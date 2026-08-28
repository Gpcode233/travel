import EventHero from "@/components/EventHero";
import EventDetails from "@/components/EventDetails";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <EventHero />
      <EventDetails />
    </main>
  );
}
