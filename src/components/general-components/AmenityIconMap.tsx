// AmenityIconMap.tsx
import {
  Wifi,
  Thermometer,
  Sun,
  Tv,
  AirVent,
  AlertCircle,
  Laptop,
  Lock,
  Bed,
  Coffee,
  Microwave,
  CookingPot,
  Accessibility,
  Hand,
  Home,
  Refrigerator,
  CircleParking,
  Shirt,
  WashingMachine,
  BriefcaseMedical,
  FlameKindling,
  AlarmSmoke,
  Anvil,
  DoorClosed,
  Milk,
  Bath,
  BedDouble,
  ShowerHead,
  DoorOpen,
  Building,
  Cable,
  EthernetPort,
  Shield,
  Waves,
  Dumbbell,
  Cigarette,
} from "lucide-react";

export type AmenityKey =
  | "Wifi"
  | "Internet"
  | "Cable TV"
  | "Kitchen"
  | "Parking"
  | "Heating"
  | "Essentials"
  | "Hangers"
  | "TV"
  | "Air conditioning"
  | "Washer"
  | "Dryer"
  | "Smoke detector"
  | "First aid kit"
  | "Fire extinguisher"
  | "Hair dryer"
  | "Iron"
  | "Laptop friendly workspace"
  | "Private entrance"
  | "Shampoo"
  | "Lock on bedroom door"
  | "Hot water"
  | "Bed linens"
  | "Extra pillows and blankets"
  | "Microwave"
  | "Coffee maker"
  | "Refrigerator"
  | "Dishwasher"
  | "Cooking basics"
  | "Oven"
  | "Stove"
  | "Accessible parking spot"
  | "Step-free path to the guest entrance"
  | "Step-free bedroom access"
  | "Shower or bath chair"
  | "Wide doorway"
  | "Elevator"
  | "Wide entryway"
  | "Accessible-height bed"
  | "Step-free access"
  | "Accessible-height toilet"
  | "Fixed grab bars for shower"
  | "Handheld shower head"
  | "Lowered electrical outlets"
  | "Wide hallways"
  | "Roll-in shower"
  | "Braille signage"
  | "Free street parking"
  | "Pool"
  | "Hot tub"
  | "Gym"
  | "Smoking allowed"
  | "Doorman"
  | "Safety card";

export const iconMap: Record<AmenityKey, JSX.Element> = {
  Wifi: <Wifi />,
  Kitchen: <Refrigerator />,
  Parking: <CircleParking />,
  Heating: <Thermometer />,
  Essentials: <Sun />,
  Hangers: <Shirt />,
  TV: <Tv />,
  "Air conditioning": <AirVent />,
  Washer: <WashingMachine />,
  Dryer: <WashingMachine />,
  "Smoke detector": <AlertCircle />,
  "First aid kit": <BriefcaseMedical />,
  "Fire extinguisher": <FlameKindling />,
  "Hair dryer": <AlarmSmoke />,
  Iron: <Anvil />,
  "Laptop friendly workspace": <Laptop />,
  "Private entrance": <DoorClosed />,
  Shampoo: <Milk />,
  "Lock on bedroom door": <Lock />,
  "Hot water": <Bath />,
  "Bed linens": <Bed />,
  "Extra pillows and blankets": <BedDouble />,
  Microwave: <Microwave />,
  "Coffee maker": <Coffee />,
  Refrigerator: <Refrigerator />,
  Dishwasher: <CookingPot />,
  "Cooking basics": <CookingPot />,
  Oven: <Microwave />,
  Stove: <Microwave />,
  "Accessible parking spot": <Accessibility />,
  "Step-free path to the guest entrance": <Accessibility />,
  "Step-free bedroom access": <Accessibility />,
  "Shower or bath chair": <ShowerHead />,
  "Wide doorway": <DoorOpen />,
  Elevator: <Building />,
  "Wide entryway": <DoorOpen />,
  "Accessible-height bed": <Bed />,
  "Step-free access": <Accessibility />,
  "Accessible-height toilet": <Accessibility />,
  "Fixed grab bars for shower": <Hand />,
  "Handheld shower head": <ShowerHead />,
  "Lowered electrical outlets": <Home />,
  "Wide hallways": <DoorOpen />,
  "Roll-in shower": <ShowerHead />,
  "Braille signage": <Home />,
  Internet: <EthernetPort />,
  "Cable TV": <Cable />,
  "Safety card": <Shield />,
  "Free street parking": <CircleParking />,
  Pool: <Waves />,
  "Hot tub": <Bath />,
  Gym: <Dumbbell />,
  "Smoking allowed": <Cigarette />,
  Doorman: <DoorClosed />,
};
