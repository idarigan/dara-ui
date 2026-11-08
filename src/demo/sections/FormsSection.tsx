import { useState } from "react";
import {
  Checkbox,
  Dropdown,
  Input,
  Radio,
  Range,
  Switch,
  useI18n,
} from "../../index";
import { Preview, Section } from "../Section";

const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid.js" },
];

export const FormsSection = () => {
  const { t } = useI18n();
  const [framework, setFramework] = useState("react");
  const [plan, setPlan] = useState("pro");

  return (
    <Section
      id="forms"
      title={t("demo.sections.forms.title")}
      description={t("demo.sections.forms.description")}
    >
      <Preview
        title={t("inputs.title")}
        grid
        code={`<Input label="Email" type="email" helperText="We never share it." />`}
      >
        <Input
          label={t("inputs.username")}
          placeholder={t("inputs.enterUsername")}
        />
        <Input
          label={t("inputs.email")}
          type="email"
          placeholder={t("inputs.enterEmail")}
          helperText={t("inputs.emailHelper")}
        />
        <Input type="password" placeholder={t("inputs.password")} />
        <Input
          placeholder={t("inputs.success")}
          validation="success"
          successMessage={t("inputs.validInput")}
        />
        <Input
          placeholder={t("inputs.error")}
          validation="error"
          errorMessage={t("inputs.somethingWrong")}
        />
      </Preview>

      <Preview title={t("dropdown.title")}>
        <Dropdown
          options={frameworks}
          value={framework}
          onChange={setFramework}
          label={t("dropdown.framework")}
          placeholder={t("dropdown.selectFramework")}
          searchable
        />
      </Preview>

      <Preview title={t("checkbox.title")}>
        <Checkbox label={t("checkbox.unchecked")} />
        <Checkbox label={t("checkbox.checked")} defaultChecked glow />
        <Checkbox label={t("checkbox.error")} error />
        <Checkbox label={t("checkbox.disabled")} disabled />
      </Preview>

      <Preview title={t("switch.title")}>
        <Switch label={t("switch.off")} />
        <Switch label={t("switch.glowOn")} defaultChecked glow />
        <Switch label={t("switch.disabledOn")} defaultChecked disabled />
      </Preview>

      <Preview title={t("radio.title")}>
        {(["free", "pro", "enterprise"] as const).map((value, index) => (
          <Radio
            key={value}
            name="demo-plan"
            value={value}
            label={t(`radio.groupOption${index + 1}`)}
            checked={plan === value}
            onChange={() => setPlan(value)}
            glow={plan === value}
          />
        ))}
      </Preview>

      <Preview title={t("range.title")} grid>
        <Range defaultValue={65} label={t("range.volume")} />
        <Range
          defaultValue={42}
          label={t("range.brightness")}
          color="secondary"
        />
        <Range defaultValue={80} label={t("range.contrast")} color="accent" />
      </Preview>
    </Section>
  );
};
