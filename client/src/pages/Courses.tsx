import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import CourseList from "@/features/courses/components/CourseList";
import CourseEnrollModal from "@/features/courses/components/CourseEnrollModal";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { AgeGroup, AGE_GROUP_LABELS, AGE_GROUP_RANGES, Course } from "@/types";
import { Users, Baby, GraduationCap } from "lucide-react";

const AGE_GROUP_ORDER: AgeGroup[] = ["CHILDREN", "TEENAGERS", "ADULTS"];

const AGE_GROUP_ICONS: Record<AgeGroup, React.ReactNode> = {
  CHILDREN: <Baby className="h-5 w-5" />,
  TEENAGERS: <GraduationCap className="h-5 w-5" />,
  ADULTS: <Users className="h-5 w-5" />,
};

const AGE_GROUP_DESCRIPTIONS: Record<AgeGroup, string> = {
  CHILDREN:
    "Fun, engaging programs that build focus, pattern recognition, and logical thinking from an early age.",
  TEENAGERS:
    "Structured curriculum designed to deepen strategic thinking, competitive play, and tournament readiness.",
  ADULTS:
    "Flexible learning paths for working professionals and enthusiasts looking to master the royal game.",
};

export default function CoursesPage() {
  const { courses, isLoading } = useAdminCourses();
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);

  const groupedCourses = AGE_GROUP_ORDER.reduce<Record<AgeGroup, typeof courses>>(
    (acc, group) => {
      acc[group] = courses.filter((c) => c.ageGroup === group);
      return acc;
    },
    { CHILDREN: [], TEENAGERS: [], ADULTS: [] }
  );

  const populatedGroups = AGE_GROUP_ORDER.filter((group) => groupedCourses[group].length > 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        label="Academy"
        title={
          <>
            Our <span className="text-gradient-gold">Programs</span>
          </>
        }
        description="From foundation to mastery — structured curriculum designed by experts for every stage of your chess journey."
      />

      {isLoading ? (
        <section className="section-padding">
          <div className="container mx-auto text-center py-20 text-muted-foreground">
            Loading programs...
          </div>
        </section>
      ) : courses.length === 0 ? (
        <section className="section-padding">
          <div className="container mx-auto text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">No programs available at the moment. Check back soon!</p>
          </div>
        </section>
      ) : (
        <>
          {populatedGroups.map((group, idx) => (
            <section
              key={group}
              className={`section-padding ${idx % 2 !== 0 ? "bg-card/50" : ""}`}
            >
              <div className="container mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {AGE_GROUP_ICONS[group]}
                    {AGE_GROUP_RANGES[group]}
                  </span>
                </div>
                <SectionHeading
                  title={`${AGE_GROUP_LABELS[group]} Programs`}
                  description={AGE_GROUP_DESCRIPTIONS[group]}
                  centered={false}
                />
                <CourseList courses={groupedCourses[group]} onEnroll={setEnrollCourse} />
              </div>
            </section>
          ))}
        </>
      )}

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
              <p className="text-muted-foreground mb-6">
                Personalized mentorship with Grandmasters and International Masters tailored to your
                specific strengths and weaknesses.
              </p>
              <ul className="space-y-3 mb-8">
                {["Customized Study Plan", "Deep Game Analysis", "Opening Repertoire Building", "Flexible Scheduling"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  )
                )}
              </ul>
              <button className="text-primary font-semibold hover:underline">Inquire for Pricing →</button>
            </div>
            <div className="bg-background border border-border rounded-2xl p-8 card-hover">
              <h3 className="font-heading font-bold text-2xl mb-4">Corporate Workshops</h3>
              <p className="text-muted-foreground mb-6">
                Using chess as a metaphor for strategic thinking, decision making, and leadership in
                the business world.
              </p>
              <ul className="space-y-3 mb-8">
                {["Team Building", "Strategic Planning", "Risk Management", "Executive Coaching"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  )
                )}
              </ul>
              <button className="text-primary font-semibold hover:underline">Request a Proposal →</button>
            </div>
          </div>
        </div>
      </section>

      <CTAStrip />

      <CourseEnrollModal
        course={enrollCourse}
        open={!!enrollCourse}
        onOpenChange={(open) => { if (!open) setEnrollCourse(null); }}
      />
    </div>
  );
}
