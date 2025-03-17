import { useState } from "react";
import { MenuItem, Icon } from "@czi-sds/components";
import { ComponentProps, ReactNode } from "react";
import { MenuDropdown } from "app/components/MenuDropdown";
import { MenuItemHeader } from "app/components/MenuItemHeader";
import { MenuItemLink } from "app/components/MenuItemLink";
import { NavLink } from "../Layout/constants";
import { useI18n } from 'app/hooks/useI18n'

type OptionItem = {
  label: string;
  checked: boolean;
  subLabel?: string;
};

type Section = {
  title?: string;
  links?: NavLink[];
  options?: OptionItem[];
};

type CustomDropdownProps = {
  className?: string;
  title?: string;
  sections: Section[];
  variant?: "standard" | "outlined" | "filled";
  buttonElement?: ReactNode;
};

function MenuItemOption({
  selected,
  onClick,
  children,
  ...props
}: ComponentProps<typeof MenuItem> & {
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <MenuItem {...props} onClick={onClick}>
      <div className="flex items-center justify-center flex-auto gap-3">
        <div className="inline-block w-4 h-4">
          {selected ? (
            <Icon sdsIcon="Check" sdsType="button" sdsSize="s" className="!fill-[#0B68F8]" />
          ) : null}
        </div>
        <div className={`flex-auto ${selected && "font-semibold"}`}>{children}</div>
      </div>
    </MenuItem>
  );
}



export function CustomDropdown({
  className,
  title,
  variant = "standard",
  sections: initialSections,
  buttonElement,
}: CustomDropdownProps) {
  const { t } = useI18n()
  const [sections, setSections] = useState(initialSections);

  const handleToggle = (sectionIndex: number, optionIndex: number) => {
    setSections((prevSections) =>
      prevSections.map((section, sIdx) =>
        sIdx === sectionIndex
          ? {
              ...section,
              options: section.options?.map((option, oIdx) =>
                oIdx === optionIndex ? { ...option, checked: !option.checked } : option
              ),
            }
          : section
      )
    );
  };

  return (
    <MenuDropdown className={className} title={title} variant={variant} buttonElement={buttonElement}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.title && <MenuItemHeader>{section.title}</MenuItemHeader>}

          {section.links &&
            section.links.map(({ label, link }) => (
              <MenuItemLink key={label} to={link}>
                {t(label)}
              </MenuItemLink>
          ))}

          {section.options &&
            section.options.map(({ label, checked, subLabel }, optionIndex) => (
              <MenuItemOption key={label} selected={checked} onClick={() => handleToggle(sectionIndex, optionIndex)}>
                <div className="flex flex-col">
                  <span>{label}</span>
                  {subLabel && <span className="text-xs text-[#767676] font-normal">{subLabel}</span>}
                </div>
              </MenuItemOption>
          ))}
        </div>
      ))}
    </MenuDropdown>
  );
}
