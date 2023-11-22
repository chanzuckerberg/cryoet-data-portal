const CONTRIBUTORS = `
David Agard
Ben Barad
Florian Bec
John Briggs
Zhen Chen
Jane Ding
Ben Engel
Ryan Feathers
Sara Goetz
Danielle Grotjhan
Gus Hart
Grant Jensen
Mohammed Kaplan
Zunlong Ke
Sagar Khavnekar
Abhay Kotecha
Jun Liu
Julia Mahamid
Michaela Medina
Jürgen Plitzko
Ricado Righetto
Kem Sochacki
Matt Swulius
Liang Xue
Huaxin Yu
Ellen Zhong
`

export function IndexContributors() {
  const contributors = CONTRIBUTORS.split('\n').filter(Boolean)

  return (
    <div className="flex flex-col gap-sds-xl h-full">
      <h3 className="font-sds-semibold font-semibold text-sds-header-xl leading-sds-header-xl">
        Thank You to our Data Contributors…
      </h3>
      <ul className="grid grid-flow-col grid-rows-[repeat(7,_minmax(0,_1fr))] grid-cols-4 gap-y-sds-xxs gap-x-sds-xl">
        {contributors.map((name) => (
          <li className="text-sds-body-xs leading-sds-body-xs">{name}</li>
        ))}
      </ul>
    </div>
  )
}
