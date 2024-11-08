import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

  
  export function AccordionDemo() {
    return (
        <Accordion type="single" collapsible className="w-full text-white xl:px-44">
        <AccordionItem value="item-1">
          <AccordionTrigger>How does TAuth's keystroke biometrics work?</AccordionTrigger>
          <AccordionContent>
            TAuth analyzes your unique typing patterns - like rhythm, speed, and key press duration. Just like a fingerprint, 
            your typing style is unique to you. Our AI learns these patterns to create a secure biometric profile that can't 
            be replicated or stolen.
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="item-2">
          <AccordionTrigger>Is TAuth more secure than traditional passwords?</AccordionTrigger>
          <AccordionContent>
            Yes! While passwords can be stolen or guessed, your typing pattern is virtually impossible to replicate. TAuth combines 
            AI with behavioral biometrics to create a security layer that's both stronger and more convenient than traditional 
            authentication methods.
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="item-3">
          <AccordionTrigger>What if my typing pattern changes when I'm tired or injured?</AccordionTrigger>
          <AccordionContent>
            Our AI continuously learns and adapts to subtle changes in your typing patterns. For significant temporary changes 
            (like an injured hand), TAuth includes fallback authentication methods to ensure you always have access to your account.
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="item-4">
          <AccordionTrigger>How quick is the integration process?</AccordionTrigger>
          <AccordionContent>
            TAuth can be integrated in minutes with just a few lines of code. We provide SDKs for popular frameworks like React, 
            Next.js, and Vue, along with comprehensive documentation and pre-built components to get you started quickly.
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="item-5">
          <AccordionTrigger>What about privacy and data protection?</AccordionTrigger>
          <AccordionContent>
            Privacy is our priority. We're GDPR compliant and SOC2 Type II certified. Your biometric data is encrypted, anonymized, 
            and never sold or shared. We only store the mathematical representations of your typing patterns, not the actual keystrokes.
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="item-6">
          <AccordionTrigger>Can TAuth handle multiple devices and keyboards?</AccordionTrigger>
          <AccordionContent>
            Yes! TAuth creates separate profiles for different devices while maintaining the same high level of security. Our AI 
            adapts to your typing patterns across different keyboards and devices, ensuring consistent authentication everywhere.
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="item-7">
          <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
          <AccordionContent>
            Yes! We offer a generous free tier that includes up to 100 active users, basic analytics, and all essential features. 
            Perfect for testing TAuth in your application or for small projects. No credit card required to get started.
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="item-8">
          <AccordionTrigger>What kind of support do you provide?</AccordionTrigger>
          <AccordionContent>
            All plans include community support and comprehensive documentation. Pro and Enterprise plans feature priority support, 
            dedicated account managers, and custom implementation assistance. We're here to ensure your success with TAuth.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  