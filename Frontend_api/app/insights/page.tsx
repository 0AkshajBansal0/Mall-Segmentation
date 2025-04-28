import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Users, ShoppingCart, TrendingUp, Target } from "lucide-react"

export default function Insights() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Customer Insights</h1>
        </div>
      </header>

      <div className="container flex-1 space-y-6 p-8 pt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Targeted Marketing</CardTitle>
                <CardDescription>Strategies for each segment</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-rose-50 p-4 text-rose-800">
                  <h3 className="font-semibold">Premium Shoppers</h3>
                  <p className="text-sm mt-1">
                    Focus on luxury products, exclusive offers, and premium shopping experiences. Emphasize quality and
                    status in marketing materials.
                  </p>
                </div>

                <div className="rounded-md bg-blue-50 p-4 text-blue-800">
                  <h3 className="font-semibold">Potential Shoppers</h3>
                  <p className="text-sm mt-1">
                    Target with value propositions, limited-time offers, and loyalty programs to increase spending.
                    Highlight product benefits and value.
                  </p>
                </div>

                <div className="rounded-md bg-amber-50 p-4 text-amber-800">
                  <h3 className="font-semibold">Careful Shoppers</h3>
                  <p className="text-sm mt-1">
                    Offer financing options, installment plans, and budget-friendly alternatives. Focus on necessity and
                    practicality in messaging.
                  </p>
                </div>

                <div className="rounded-md bg-emerald-50 p-4 text-emerald-800">
                  <h3 className="font-semibold">Value Shoppers</h3>
                  <p className="text-sm mt-1">
                    Provide discounts, promotions, and clearance sales. Emphasize affordability and essential product
                    features.
                  </p>
                </div>

                <div className="rounded-md bg-violet-50 p-4 text-violet-800">
                  <h3 className="font-semibold">Standard Shoppers</h3>
                  <p className="text-sm mt-1">
                    Use balanced marketing approach with mid-range products and reasonable promotions. Focus on
                    reliability and consistent value.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Product Recommendations</CardTitle>
                <CardDescription>Suggested products by segment</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-800">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Premium Shoppers</h3>
                    <p className="text-sm text-muted-foreground">
                      Designer brands, high-end electronics, luxury services, exclusive memberships
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Potential Shoppers</h3>
                    <p className="text-sm text-muted-foreground">
                      Premium mid-range products, investment pieces, quality home goods, durable electronics
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Careful Shoppers</h3>
                    <p className="text-sm text-muted-foreground">
                      Trendy but affordable items, fashion accessories, entertainment products, experience-based
                      purchases
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                    <span className="font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Value Shoppers</h3>
                    <p className="text-sm text-muted-foreground">
                      Essential items, basic necessities, budget brands, practical household goods
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-800">
                    <span className="font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Standard Shoppers</h3>
                    <p className="text-sm text-muted-foreground">
                      Mid-range products, family-oriented items, reliable brands, practical upgrades
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Growth Opportunities</CardTitle>
                <CardDescription>Strategic business insights</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold text-primary">Customer Retention</h3>
                  <p className="text-sm mt-1">
                    Focus on retaining Premium Shoppers through personalized service and exclusive benefits. They
                    represent the highest lifetime value.
                  </p>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-semibold text-primary">Segment Transition</h3>
                  <p className="text-sm mt-1">
                    Develop strategies to move Potential Shoppers to Premium Shoppers through targeted upselling and
                    premium experiences.
                  </p>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-semibold text-primary">Product Mix Optimization</h3>
                  <p className="text-sm mt-1">
                    Adjust inventory to better match the needs of each segment, particularly focusing on the largest
                    segments.
                  </p>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-semibold text-primary">Marketing Efficiency</h3>
                  <p className="text-sm mt-1">
                    Reallocate marketing budget based on segment profitability and growth potential rather than segment
                    size.
                  </p>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-semibold text-primary">Store Layout</h3>
                  <p className="text-sm mt-1">
                    Redesign store layouts to cater to shopping patterns of different segments, with premium areas for
                    high-value customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Segment Behavior Analysis</CardTitle>
            <CardDescription>Detailed shopping patterns and preferences by segment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium">Segment</th>
                    <th className="py-3 px-4 text-left font-medium">Shopping Frequency</th>
                    <th className="py-3 px-4 text-left font-medium">Basket Size</th>
                    <th className="py-3 px-4 text-left font-medium">Price Sensitivity</th>
                    <th className="py-3 px-4 text-left font-medium">Channel Preference</th>
                    <th className="py-3 px-4 text-left font-medium">Loyalty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                        <span className="font-medium">Premium Shoppers</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">Moderate</td>
                    <td className="py-3 px-4">Very Large</td>
                    <td className="py-3 px-4">Low</td>
                    <td className="py-3 px-4">In-store & Online</td>
                    <td className="py-3 px-4">High if well-served</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">Potential Shoppers</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">Low</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">Research Online</td>
                    <td className="py-3 px-4">Low</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span className="font-medium">Careful Shoppers</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">High</td>
                    <td className="py-3 px-4">Small</td>
                    <td className="py-3 px-4">High</td>
                    <td className="py-3 px-4">Mobile & Social</td>
                    <td className="py-3 px-4">Medium</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        <span className="font-medium">Value Shoppers</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">Moderate</td>
                    <td className="py-3 px-4">Small</td>
                    <td className="py-3 px-4">Very High</td>
                    <td className="py-3 px-4">Discount Stores</td>
                    <td className="py-3 px-4">Low</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-violet-500"></div>
                        <span className="font-medium">Standard Shoppers</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">Regular</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">Omnichannel</td>
                    <td className="py-3 px-4">Medium</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actionable Recommendations</CardTitle>
            <CardDescription>Key actions to improve business performance based on segmentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Customer Experience</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Create VIP program for Premium Shoppers with personal shopping assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Implement tiered loyalty program to encourage segment progression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Develop mobile app features for Careful Shoppers who prefer digital channels</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Merchandising Strategy</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Increase premium product selection to better serve high-value segments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Create budget-friendly product lines with trendy designs for Careful Shoppers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Develop exclusive product collections for Premium Shoppers</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Promotional Calendar</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Schedule exclusive preview events for Premium and Potential Shoppers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Run flash sales and limited-time offers for Careful Shoppers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Create seasonal clearance events targeting Value Shoppers</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Marketing Channels</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Utilize direct mail and personalized email for Premium Shoppers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Invest in social media and influencer marketing for Careful Shoppers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Focus on search and comparison shopping ads for Value Shoppers</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Business Development</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Explore premium brand partnerships to attract high-value segments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Develop financing options to help Careful Shoppers increase spending</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Create subscription models for Standard Shoppers to increase loyalty</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <h3 className="font-semibold">Pricing Strategy</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Implement dynamic pricing based on customer segment and purchase history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Create tiered pricing structures with clear value propositions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Develop bundle offers targeting specific segment needs and preferences</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
