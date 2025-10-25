"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// AI Elements
import { Actions } from "@/components/ai-elements/actions";
import { Artifact } from "@/components/ai-elements/artifact";
import { Branch } from "@/components/ai-elements/branch";
import { ChainOfThought } from "@/components/ai-elements/chain-of-thought";
import { CodeBlock } from "@/components/ai-elements/code-block";
import { Context } from "@/components/ai-elements/context";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Image } from "@/components/ai-elements/image";
import { InlineCitation } from "@/components/ai-elements/inline-citation";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Reasoning } from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import Shimmer from "@/components/ai-elements/shimmer";
import { Sources } from "@/components/ai-elements/sources";
import { Suggestion } from "@/components/ai-elements/suggestion";
import { Task } from "@/components/ai-elements/task";
import { Tool } from "@/components/ai-elements/tool";
import { WebPreview } from "@/components/ai-elements/web-preview";

export default function UIComponentsPage() {
  return (
    <div className="container mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8">UI Components Showcase</h1>

      {/* UI Components Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">UI Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Alert */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Alert</h3>
            <Alert>
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can add components to your app using the cli.
              </AlertDescription>
            </Alert>
          </div>

          {/* Avatar */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Avatar</h3>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          {/* Badge */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Badge</h3>
            <Badge>Badge</Badge>
          </div>

          {/* Button */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Button</h3>
            <div className="flex gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          {/* Card */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Card</h3>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Carousel */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Carousel</h3>
            <Carousel className="w-full max-w-xs">
              <CarouselContent>
                <CarouselItem>Slide 1</CarouselItem>
                <CarouselItem>Slide 2</CarouselItem>
                <CarouselItem>Slide 3</CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Collapsible */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Collapsible</h3>
            <Collapsible>
              <CollapsibleTrigger>Toggle</CollapsibleTrigger>
              <CollapsibleContent>Content</CollapsibleContent>
            </Collapsible>
          </div>

          {/* Dialog */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>Dialog description</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dropdown Menu */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Dropdown Menu</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Open Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Item 1</DropdownMenuItem>
                <DropdownMenuItem>Item 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Hover Card */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Hover Card</h3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button>Hover me</Button>
              </HoverCardTrigger>
              <HoverCardContent>Hover content</HoverCardContent>
            </HoverCard>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Input</h3>
            <Input placeholder="Type here..." />
          </div>

          {/* Label */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Label</h3>
            <Label htmlFor="input">Label</Label>
            <Input id="input" />
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Progress</h3>
            <Progress value={33} />
          </div>

          {/* Scroll Area */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Scroll Area</h3>
            <ScrollArea className="h-20 w-full">
              <div className="p-4">
                <p>Scrollable content...</p>
                <p>More content...</p>
                <p>Even more...</p>
              </div>
            </ScrollArea>
          </div>

          {/* Select */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Select</h3>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
                <SelectItem value="2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Separator */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Separator</h3>
            <div className="flex items-center space-x-4">
              <span>Left</span>
              <Separator orientation="vertical" />
              <span>Right</span>
            </div>
          </div>

          {/* Switch */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Switch</h3>
            <Switch />
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Textarea</h3>
            <Textarea placeholder="Type here..." />
          </div>

          {/* Tooltip */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Tooltip</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button>Hover for tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Tooltip content</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </section>

      {/* AI Elements Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">AI Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Actions */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Actions</h3>
            <Actions>{/* Example actions can be added here */}</Actions>
          </div>

          {/* Artifact */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Artifact</h3>
            <Artifact>{/* Example content */}</Artifact>
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Branch</h3>
            <Branch />
          </div>

          {/* ChainOfThought */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">ChainOfThought</h3>
            <ChainOfThought />
          </div>

          {/* CodeBlock */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">CodeBlock</h3>
            <CodeBlock
              code="console.log('Hello World');"
              language="javascript"
            />
          </div>

          {/* Context */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Context</h3>
            <Context usedTokens={100} maxTokens={1000}>
              <HoverCardTrigger>Hover for context</HoverCardTrigger>
              <HoverCardContent>Context info</HoverCardContent>
            </Context>
          </div>

          {/* Conversation */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Conversation</h3>
            <Conversation>
              <ConversationContent>
                Example conversation content
              </ConversationContent>
            </Conversation>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Image</h3>
            {/* Note: Requires base64 and mediaType props */}
            <div className="text-sm text-muted-foreground">
              Requires base64 image data
            </div>
          </div>

          {/* InlineCitation */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">InlineCitation</h3>
            <InlineCitation />
          </div>

          {/* Loader */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Loader</h3>
            <Loader />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Message</h3>
            <Message from="user">
              <MessageContent>Hello!</MessageContent>
            </Message>
          </div>

          {/* Reasoning */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Reasoning</h3>
            <Reasoning />
          </div>

          {/* Response */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Response</h3>
            <Response />
          </div>

          {/* Shimmer */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Shimmer</h3>
            <Shimmer />
          </div>

          {/* Sources */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Sources</h3>
            <Sources>{/* Example sources content */}</Sources>
          </div>

          {/* Suggestion */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Suggestion</h3>
            <Suggestion suggestion="Example suggestion" />
          </div>

          {/* Task */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Task</h3>
            <Task />
          </div>

          {/* Tool */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Tool</h3>
            <Tool />
          </div>

          {/* WebPreview */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">WebPreview</h3>
            <WebPreview />
          </div>
        </div>
      </section>
    </div>
  );
}
