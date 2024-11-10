import React from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from "../components/ui/button"
import Title from './Title'

const Pricing = () => {
    const tiers = [
        {
            name: "Basic",
            description: "Perfect for getting started with keystroke biometrics",
            price: "Free",
            features: [
                "100 Authentication Requests/month",
                "Basic Analytics",
                "Community Support",
                "1 Project",
                "Standard API Access"
            ],
            callToAction: "Get Started",
            highlighted: false
        },
        {
            name: "Pro",
            description: "Ideal for growing businesses and teams",
            price: "$29",
            period: "/month",
            features: [
                "1,000 Authentication Requests/month",
                "Advanced Analytics",
                "Priority Support",
                "Unlimited Projects",
                "Advanced API Access",
                "Custom Rules Engine",
                "Team Management",
                "Webhook Integration"
            ],
            callToAction: "Start Free Trial",
            highlighted: true
        },
        {
            name: "Enterprise",
            description: "For large-scale applications and organizations",
            price: "Custom",
            features: [
                "Unlimited Authentication Requests",
                "Enterprise Analytics",
                "24/7 Dedicated Support",
                "Unlimited Projects",
                "Full API Access",
                "Custom Integration",
                "SSO Integration",
                "SLA Agreement",
                "Dedicated Account Manager"
            ],
            callToAction: "Contact Sales",
            highlighted: false
        }
    ]
    return (
        <div className=''>
            <div className='xl:px-44 lg:px-20 md:px-14 px-6'>
                <Header />
                <main className='h-auto'>
                    <Title title={"Simple, transparent pricing"} extraClassName={"text-center pt-8"} />
                    <p className="text-neutral-400 lg:text-xl text-md md:text-center xl:px-20 px-0">
                        Choose the perfect plan for your needs. All plans include a 14-day free trial.
                    </p>
                    <div className="my-24">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {tiers.map((tier) => (
                                <Card
                                    key={tier.name}
                                    className={`flex flex-col ${tier.highlighted
                                        ? 'border-primary shadow-lg scale-105'
                                        : ''
                                        }`}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-2xl">{tier.name}</CardTitle>
                                        <CardDescription>{tier.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold">{tier.price}</span>
                                            {tier.period && (
                                                <span className="text-muted-foreground">{tier.period}</span>
                                            )}
                                        </div>
                                        <ul className="space-y-3">
                                            {tier.features.map((feature) => (
                                                <li key={feature} className="flex items-center">
                                                    <Check className="text-primary h-5 w-5 flex-shrink-0 mr-3" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <div className='w-full'>
                                            <Link to={"/getting-started/auth"}>
                                                <Button
                                                    className={`w-full ${tier.highlighted ? 'bg-primary' : ''
                                                        }`}
                                                    variant={tier.highlighted ? "default" : "outline"}
                                                >
                                                    {tier.callToAction}
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default Pricing