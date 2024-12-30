import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function PremiumCard() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold">Learn even more!</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Unlock premium features only for $9.99 per month.
      </p>
      <Button className="mt-4" variant="outline">
        Go Premium
      </Button>
    </Card>
  )
}