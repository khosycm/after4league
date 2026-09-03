import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SeasonForm } from "../season-form";

export default function NewSeasonPage() {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>New season</CardTitle>
      </CardHeader>
      <SeasonForm />
    </Card>
  );
}
