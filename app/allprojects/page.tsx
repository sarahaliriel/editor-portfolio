import AllProjects from "@/components/allprojects"
import CustomCursor from "@/components/cursor-custom"
import Menu from "@/components/menu"

export default function Page() {
  return (
  <main className="relative min-h-screen bg-base text-ink">
        <CustomCursor />
  <AllProjects />
        <CustomCursor />
              <div className="relative z-10">
                <Menu />
              </div>
        </main>
  )
}