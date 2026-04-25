"use client";

import { logOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <form action={logOut}>
      <Button type="submit" variant="outline" size="sm">
        Log out
      </Button>
    </form>
  );
}
