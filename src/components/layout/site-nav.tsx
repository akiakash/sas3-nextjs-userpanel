import TopBar from "@/components/home/TopBar";
import Header from "@/components/home/Header";

type SiteNavProps = {
  activeAuth?: "login" | "register";
};

/** Homepage-style top utility bar + main navigation */
export function SiteNav({ activeAuth }: SiteNavProps) {
  return (
    <>
      <TopBar />
      <Header activeAuth={activeAuth} />
    </>
  );
}

export default SiteNav;
