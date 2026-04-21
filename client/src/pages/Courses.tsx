import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import CourseList from "@/features/courses/components/CourseList";
import { courses } from "@/services/mockData";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        label="Academy"
        title={
          <>
            Our <span className="text-gradient-gold">Programs</span>
          </>
        }
        description="From foundation to mastery — structured curriculum designed by experts for every stage of your chess journey."
      />

      <section className="section-padding pt-0">
        <div className="container mx-auto">
          <SectionHeading
            title="Regular Programs"
            description="Our core curriculum focused on long-term skill development."
            centered={false}
          />
          <CourseList courses={courses.filter(c => c.id !== 'corporate')} />
        </div>
      </section>

      <section className="section-padding bg-card/50">
        <div className="container mx-auto">
          <SectionHeading
            title="Specialized Training"
            description="Intensive sessions focused on specific aspects of the game."
            centered={false}
          />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background border border-border rounded-2xl p-8 card-hover">
              <h3 className="font-heading font-bold text-2xl mb-4">One-on-One Coaching</h3>
              <p className="text-muted-foreground mb-6">Personalized mentorship with Grandmasters and International Masters tailored to your specific strengths and weaknesses.</p>
              <ul className="space-y-3 mb-8">
                {['Customized Study Plan', 'Deep Game Analysis', 'Opening Repertoire Building', 'Flexible Scheduling'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="text-primary font-semibold hover:underline">Inquire for Pricing →</button>
            </div>
            <div className="bg-background border border-border rounded-2xl p-8 card-hover">
              <h3 className="font-heading font-bold text-2xl mb-4">Corporate Workshops</h3>
              <p className="text-muted-foreground mb-6">Using chess as a metaphor for strategic thinking, decision making, and leadership in the business world.</p>
              <ul className="space-y-3 mb-8">
                {['Team Building', 'Strategic Planning', 'Risk Management', 'Executive Coaching'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="text-primary font-semibold hover:underline">Request a Proposal →</button>
            </div>
          </div>
        </div>
      </section>

      <CTAStrip />
      <Footer />
    </div>
  );
}
