import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeading from "@/components/shared/SectionHeading";
import TournamentCard from "@/features/tournaments/components/TournamentCard";
import { tournaments, pastResults } from "@/services/mockData";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function TournamentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        label="Competition"
        title={
          <>
            Chess <span className="text-gradient-gold">Tournaments</span>
          </>
        }
        description="Test your skills against the best. We host regular state and national level tournaments across various categories."
      />

      <section className="section-padding pt-0">
        <div className="container mx-auto">
          <SectionHeading
            title="Upcoming Tournaments"
            description="Join our upcoming events and start your competitive journey."
            centered={false}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t, i) => (
              <TournamentCard key={t.id} tournament={t} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50">
        <div className="container mx-auto">
          <SectionHeading
            title="Recent Results"
            description="Celebrating the champions of our latest tournaments."
            centered={false}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {pastResults.map((result, i) => (
              <ScrollReveal key={result.id} delay={i * 0.1}>
                <div className="bg-background border border-border rounded-2xl p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">
                    {result.category}
                  </span>
                  <h4 className="font-heading font-bold text-lg mb-4">{result.tournament}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Winner</span>
                      <span className="font-semibold">{result.winner}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Runner Up</span>
                      <span className="font-semibold">{result.runnerUp}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
