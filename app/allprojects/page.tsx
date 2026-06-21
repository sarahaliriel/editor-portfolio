import AllProjects from "@/components/allprojects/allprojects"
import Menu from "@/components/layout/menu"

export default function Page() {
  return (
    <main className="relative h-svh overflow-hidden bg-[#e8e7e7] text-[#1e1e1e]">
      <AllProjects />
      <div className="relative z-10">
        <Menu />
      </div>
    </main>
  )
}
