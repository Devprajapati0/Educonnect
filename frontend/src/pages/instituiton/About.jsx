import React from "react";
import { Link } from "react-router-dom";
import { Button,
    Card,
    CardContent,
 } from "@mui/material";
import { GraduationCap, Users, Shield, Globe, Heart, Lightbulb } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background/80 to-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <section className="py-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">Our Mission</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            At EduConnect, we're dedicated to transforming educational communication by creating secure, intuitive
            platforms that bring together students, teachers, parents, and administrators.
          </p>
        </section>

        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg">
                <p>
                  EduConnect was founded in 2018 by a team of educators and technologists who recognized the need for
                  better communication tools in educational settings.
                </p>
                <p>
                  After witnessing firsthand the challenges of coordinating between various stakeholders in education,
                  our founders set out to create a platform that would streamline communication while maintaining
                  appropriate boundaries and security.
                </p>
                <p>
                  What began as a simple messaging tool has evolved into a comprehensive communication platform serving
                  thousands of educational institutions worldwide, from small private schools to large public
                  universities.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <GraduationCap className="h-24 w-24 text-primary mx-auto mb-4" />
                <p className="text-2xl font-medium">Founded in 2018</p>
                <p className="text-muted-foreground mt-2">By educators, for educators</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Shield className="h-12 w-12 text-primary" />}
              title="Security & Privacy"
              description="We prioritize the protection of sensitive educational data and communications, adhering to the highest standards of security and privacy."
            />
            <ValueCard
              icon={<Users className="h-12 w-12 text-primary" />}
              title="Inclusivity"
              description="We design our platform to be accessible and usable by all members of the educational community, regardless of role, ability, or technical expertise."
            />
            <ValueCard
              icon={<Lightbulb className="h-12 w-12 text-primary" />}
              title="Innovation"
              description="We continuously evolve our platform based on educational research, user feedback, and technological advancements to better serve our users."
            />
            <ValueCard
              icon={<Heart className="h-12 w-12 text-primary" />}
              title="Empathy"
              description="We approach every feature and decision with empathy for the diverse needs and challenges of educational stakeholders."
            />
            <ValueCard
              icon={<Globe className="h-12 w-12 text-primary" />}
              title="Global Impact"
              description="We strive to make quality educational communication tools accessible to institutions around the world, supporting educational excellence globally."
            />
            <ValueCard
              icon={<GraduationCap className="h-12 w-12 text-primary" />}
              title="Educational Focus"
              description="We maintain a laser focus on the unique needs of educational institutions, rather than adapting generic communication tools to educational contexts."
            />
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <TeamMember
              name="Dr. Sarah Chen"
              role="Co-Founder & CEO"
              bio="Former university professor with 15 years in educational technology."
            />
            <TeamMember
              name="Michael Rodriguez"
              role="Co-Founder & CTO"
              bio="Software engineer with a passion for creating tools that enhance learning."
            />
            <TeamMember
              name="Dr. James Wilson"
              role="Chief Educational Officer"
              bio="Former school principal with expertise in educational communication."
            />
            <TeamMember
              name="Aisha Patel"
              role="Head of Product"
              bio="UX specialist focused on creating intuitive educational interfaces."
            />
            <TeamMember
              name="David Kim"
              role="Head of Security"
              bio="Cybersecurity expert specializing in educational data protection."
            />
            <TeamMember
              name="Emily Johnson"
              role="Customer Success Director"
              bio="Former teacher dedicated to helping institutions implement EduConnect."
            />
            <TeamMember
              name="Carlos Mendez"
              role="Engineering Lead"
              bio="Full-stack developer with expertise in scalable educational platforms."
            />
            <TeamMember
              name="Lisa Thompson"
              role="Head of Marketing"
              bio="Educational technology marketing specialist with a background in K-12 administration."
            />
          </div>
        </section>

        <section className="py-16 bg-muted/30 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're always looking for passionate individuals who share our mission of improving educational
            communication.
          </p>
          <Button size="lg" asChild>
            <Link href="/careers">View Open Positions</Link>
          </Button>
        </section>
      </main>

     <Footer />

    </div>
  );
}

function ValueCard({ icon, title, description }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TeamMember({ name, role, bio }) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
        <Users className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <h3 className="font-medium">{name}</h3>
      <p className="text-primary text-sm mb-2">{role}</p>
      <p className="text-sm text-muted-foreground">{bio}</p>
    </div>
  );
}