import { notFound } from "next/navigation";
import { AnimationDetail } from "../components";
import { animations, getAnimation } from "../animations";

export function generateStaticParams() {
  return animations.map((animation) => ({ slug: animation.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const animation = getAnimation(slug);
  if (!animation) return { title: "Animation not found" };
  return {
    title: animation.name,
    description: animation.description,
    openGraph: {
      title: animation.name + " — Motion Foundry",
      description: animation.description,
    },
  };
}

export default async function AnimationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const animation = getAnimation(slug);
  if (!animation) notFound();
  return <AnimationDetail animation={animation} />;
}
