import {
  apiClient,
  LoginRequest,
  LoginResponse,
  UserProfile,
  RegisterRequest,
} from "./api";

interface StoredTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

class AuthService {
  private refreshTimer: NodeJS.Timeout | null = null;

  // Token storage utilities
  setTokens(loginResponse: LoginResponse): void {
    const expiresAt = Date.now() + loginResponse.expires_in * 1000;

    localStorage.setItem("access_token", loginResponse.access_token);
    localStorage.setItem("refresh_token", loginResponse.refresh_token);
    localStorage.setItem("token_expires_at", expiresAt.toString());
    localStorage.setItem("user_profile", JSON.stringify(loginResponse.user));

    // Schedule token refresh
    this.scheduleTokenRefresh(expiresAt);
  }

  getTokens(): StoredTokens | null {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const expiresAt = localStorage.getItem("token_expires_at");

    if (!accessToken || !refreshToken || !expiresAt) {
      return null;
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: parseInt(expiresAt, 10),
    };
  }

  getUserProfile(): UserProfile | null {
    const userProfile = localStorage.getItem("user_profile");
    if (!userProfile) return null;

    try {
      return JSON.parse(userProfile);
    } catch {
      return null;
    }
  }

  clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_at");
    localStorage.removeItem("user_profile");

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  isTokenValid(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;

    // Check if token expires within the next 5 minutes
    return tokens.expires_at > Date.now() + 5 * 60 * 1000;
  }

  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    const user = this.getUserProfile();
    return !!(tokens && user && this.isTokenValid());
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<UserProfile> {
    try {
      const response = await apiClient.login(credentials);
      this.setTokens(response);
      return response.user;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<void> {
    await apiClient.register(data);
    // Registration doesn't automatically log in the user
    // They need to use the login form after successful registration
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      this.clearTokens();
    }
  }

  async refreshTokens(): Promise<void> {
    const tokens = this.getTokens();
    if (!tokens?.refresh_token) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await apiClient.refreshToken(tokens.refresh_token);

      // Update stored tokens with new values
      const newTokens: StoredTokens = {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_at: Date.now() + response.expires_in * 1000,
      };

      localStorage.setItem("access_token", newTokens.access_token);
      localStorage.setItem("refresh_token", newTokens.refresh_token);
      localStorage.setItem("token_expires_at", newTokens.expires_at.toString());

      // Schedule next refresh
      this.scheduleTokenRefresh(newTokens.expires_at);
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      throw error;
    }
  }

  private scheduleTokenRefresh(expiresAt: number): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh 5 minutes before expiration
    const refreshTime = expiresAt - Date.now() - 5 * 60 * 1000;

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshTokens().catch((error) => {
          console.error("Scheduled token refresh failed:", error);
        });
      }, refreshTime);
    }
  }

  // Initialize auth state on app start
  async initializeAuth(): Promise<UserProfile | null> {
    const tokens = this.getTokens();
    const user = this.getUserProfile();

    if (!tokens || !user) {
      return null;
    }

    // Check if token is still valid
    if (!this.isTokenValid()) {
      try {
        await this.refreshTokens();
        return this.getUserProfile();
      } catch {
        this.clearTokens();
        return null;
      }
    }

    // Schedule token refresh for valid tokens
    this.scheduleTokenRefresh(tokens.expires_at);
    return user;
  }
}

export const authService = new AuthService();
