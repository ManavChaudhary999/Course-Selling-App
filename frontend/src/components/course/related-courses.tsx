import { Heart } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const relatedCourses = [
  {
    title: "Complete web design",
    image: "/placeholder.svg?height=200&width=300",
    price: "$20.30",
    isBestseller: true,
  },
  {
    title: "Figma UI/UX Esential",
    image: "/placeholder.svg?height=200&width=300",
    price: "$23.00",
    isBestseller: true,
  },
]

export function RelatedCourses() {
  return (
    <div className="grid gap-4">
      {relatedCourses.map((course, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="grid gap-4">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{course.title}</h3>
                  <div className="flex items-center gap-2">
                    {course.isBestseller && (
                      <Badge variant="secondary">Bestseller</Badge>
                    )}
                    <span className="font-bold">{course.price}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}