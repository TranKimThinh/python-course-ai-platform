import { Save, UserRound } from "lucide-react";
import { type ReactNode } from "react";
import { type ProfileFormData } from "./profileTypes";

interface ProfileInfoFormProps {
  data: ProfileFormData;
  onChange: (data: ProfileFormData) => void;
  onSubmit: () => void;
}

function ProfileInfoForm({ data, onChange, onSubmit }: ProfileInfoFormProps) {
  const updateField = (field: keyof ProfileFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-card">
      <SectionTitle icon={<UserRound size={21} />} title="Thông tin cá nhân" />
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <ProfileInput label="Họ và tên" value={data.fullName} onChange={(value) => updateField("fullName", value)} />
        <ProfileInput label="Email" type="email" value={data.email} onChange={(value) => updateField("email", value)} />
        <ProfileInput label="Số điện thoại" value={data.phone} onChange={(value) => updateField("phone", value)} />
      </div>
      <button
        type="button"
        onClick={onSubmit}
        className="focus-ring mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
      >
        <Save size={17} />
        Cập nhật thông tin
      </button>
    </section>
  );
}

interface ProfileInputProps {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}

function ProfileInput({ label, value, type = "text", onChange }: ProfileInputProps) {
  const fieldName = label.toLowerCase().replace(/\s+/g, "");
  const autoCompleteMap: Record<string, string> = {
    "họvàtên": "name",
    "email": "email",
    "sốđiệnthoại": "tel",
  };
  const autoComplete = autoCompleteMap[fieldName] || "off";

  return (
    <label className="group block">
      <span className="mb-2 block text-sm font-bold text-slate-700 transition group-focus-within:text-indigo-600">
        {label}
      </span>
      <input
        id={fieldName}
        name={fieldName}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  );
}

export function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">{icon}</span>
        <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>
      </div>
      <div className="mt-3 h-1 w-16 rounded-full bg-indigo-600" />
    </div>
  );
}

export default ProfileInfoForm;
