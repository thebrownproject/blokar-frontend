"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Eye,
  Building,
  Mail,
  Phone,
  Building2,
  Calculator,
  HardHat,
  Users,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePanel } from "@/hooks/use-panel";
import type { ContactWithProject } from "@/hooks/contacts-context";
import { CONTACT_TYPE_META } from "@/types/contacts";

interface ContactCardProps {
  contact: ContactWithProject;
}

export function ContactCard({ contact }: ContactCardProps) {
  const isMobile = useIsMobile();
  const { openPanel } = usePanel();

  // Get contact type configuration
  const contactTypeConfig = CONTACT_TYPE_META[contact.contact_type];

  // Get the appropriate icon
  const getContactTypeIcon = (contactType: string) => {
    switch (contactType) {
      case "council":
        return Building2;
      case "engineer":
        return Calculator;
      case "contractor":
        return HardHat;
      case "consultant":
        return Users;
      default:
        return Building2;
    }
  };

  const ContactTypeIcon = getContactTypeIcon(contact.contact_type);

  const handleViewContact = () => {
    openPanel("view-contact", { contactId: contact.id });
  };

  const handleEditContact = () => {
    openPanel("edit-contact", { contactId: contact.id });
  };

  const handleEmailClick = () => {
    if (contact.email) {
      window.open(`mailto:${contact.email}`, "_blank");
    }
  };

  const handlePhoneClick = () => {
    if (contact.phone) {
      window.open(`tel:${contact.phone}`, "_blank");
    }
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <ContactTypeIcon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {contact.name}
            </CardTitle>
          </div>

          {contact.company && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Building className="h-3 w-3" />
              <span>{contact.company}</span>
            </div>
          )}

          {contact.project_name && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Building className="h-3 w-3" />
              <span>{contact.project_name}</span>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
          >
            <DropdownMenuItem onClick={handleViewContact}>
              <Eye className="text-muted-foreground" />
              <span>View Contact</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditContact}>
              <Edit className="text-muted-foreground" />
              <span>Edit Contact</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Contact Type Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={contactTypeConfig.color}>
              {contactTypeConfig.label}
            </Badge>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            {contact.email && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground flex-1 min-w-0">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEmailClick}
                  className="h-8 w-8 p-0 hover:bg-muted ml-2"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            )}

            {contact.phone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground flex-1 min-w-0">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{contact.phone}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePhoneClick}
                  className="h-8 w-8 p-0 hover:bg-muted ml-2"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Footer with created date */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              {contactTypeConfig.description}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(contact.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
