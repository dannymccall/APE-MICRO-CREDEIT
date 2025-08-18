import { Label } from "../lib/MyFormInput/FormTemplates";

export const inputClasses =
  "block w-full px-5 py-2 text-sm border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

export function FormField({ label, required, children }: any) {
  return (
    <div className="flex flex-col my-3 w-full">
      <div className="flex flex-row gap-1 items-center">
        <Label
          className="font-sans font-semibold text-gray-500 text-sm"
          labelName={label}
        />
        {required && <span className="text-red-500">*</span>}
      </div>
      {children}
    </div>
  );
}

export function InputField({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  readOnly = false,
  defaultChecked = false,
  defaultValue
}: any) {
  const props: any = {
    type,
    name,
    placeholder,
    disabled,
    readOnly,
    className: inputClasses,
    defaultChecked,
  };

  // Controlled input if value & onChange provided
  if (onChange || readOnly) {
    props.value = value;
    props.onChange = onChange;
  } else if (defaultValue !== undefined) {
    // Use defaultValue only if it's passed
    props.defaultValue = defaultValue;
  }

  return <input {...props} />;
}


export function SelectField({
  name,
  value,
  onChange,
  options,
  placeholder,
}: any) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`${inputClasses} cursor-pointer`}
    >
      <option disabled value="">
        {placeholder}
      </option>
      {options.map((opt: any, index: any) => (
        <option key={index} value={opt.toLowerCase()} className="text-sm font-sans">
          {opt}
        </option>
      ))}
    </select>
  );
}

export function RadioField({
  name,
  value,
  onChange,
  options,
  placeholder,
  label,
  children,
  required,
}: any) {
  return (
    <div className="w-full flex tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col gap-3 flex-wrap">
      <div className="flex  w-32 sflex-row gap-1 items-center">
        <Label
          className="font-sans font-semibold text-gray-500 text-sm"
          labelName={label}
        />
        {required && <span className="text-red-500">*</span>}
      </div>
      {options.map((option: any, index: any) => (
        <div className="flex flex-row items-center mr-10 gap-3" key={index}>
          <Label
            className="w-16 font-sans font-semibold text-gray-500"
            labelName={option}
          />
          <input
            type="radio"
            name={name}
            className="radio radio-primary text-sm w-4 h-4"
            defaultChecked={index === 0}
            value={option}
          />
        </div>
      ))}
      {children}
    </div>
  );
}
