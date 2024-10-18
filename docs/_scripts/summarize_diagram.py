remove = [
    "DepositionAuthor",
    "DatasetAuthor",
    "TomogramAuthor",
    "AnnotationAuthor",
    "DatasetFunding",
]

with open("_scripts/ER_DIAGRAM.md", "r") as f:
    lines = f.readlines()

with open("_scripts/ER_DIAGRAM-parsed.md", "w") as f:
    f.write("```{eval-rst}\n.. md-mermaid::\n   erDiagram\n")
    for line in lines:
        if not any([item in line for item in remove]) and "||" in line:
            f.write("      "+line)
    f.write("```")
