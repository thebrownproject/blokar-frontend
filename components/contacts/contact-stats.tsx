"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calculator, HardHat, Users } from "lucide-react";
import type { ContactWithProject } from "@/hooks/contacts-context";

interface ContactStatsProps {
  contacts: ContactWithProject[];
  isLoading: boolean;
}

export function ContactStats({ contacts, isLoading }: ContactStatsProps) {
  // Calculate stats from contacts
  const stats = {
    totalContacts: contacts.length,
    council: contacts.filter((c) => c.contact_type === "council").length,
    engineer: contacts.filter((c) => c.contact_type === "engineer").length,
    contractor: contacts.filter((c) => c.contact_type === "contractor").length,
    consultant: contacts.filter((c) => c.contact_type === "consultant").length,
  };

  const statCards = [
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      description: "All contacts across projects",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Council",
      value: stats.council,
      description: "Planning & council staff",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Engineers",
      value: stats.engineer,
      description: "Structural & civil engineers",
      icon: Calculator,
      color: "text-green-600",
    },
    {
      title: "Contractors",
      value: stats.contractor,
      description: "Construction specialists",
      icon: HardHat,
      color: "text-orange-600",
    },
    {
      title: "Consultants",
      value: stats.consultant,
      description: "Advisory specialists",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 auto-fit-cards">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
