import { LockKeyhole, Save } from "lucide-react";
import { type FormEvent } from "react";
import { SectionTitle } from "./ProfileInfoForm";
import { type PasswordFormData, type PasswordFormErrors } from "./profileTypes";

interface SecurityFormProps {
  data: PasswordFormData;
  errors: PasswordFormErrors;
  onChange: (data: PasswordFormData) => void;
  onSubmit: () => void;
}

function SecurityForm({ data, errors, onChange, onSubmit }: SecurityFormProps) {
  const updateField = (field: keyof PasswordFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("🚀 Form đã được submit, chuẩn bị gọi onSubmit của thẻ cha!");
    onSubmit();
  };

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-card">
      <SectionTitle icon={<LockKeyhole size={21} />} title="Bảo mật tài khoản" />
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-5 md:grid-cols-2">
          <PasswordInput
            label="Mật khẩu hiện tại"
            placeholder="••••••••"
            value={data.currentPassword}
            error={errors.currentPassword}
            onChange={(value) => updateField("currentPassword", value)}
          />
          <PasswordInput
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            value={data.newPassword}
            error={errors.newPassword}
            onChange={(value) => updateField("newPassword", value)}
          />
          <PasswordInput
            label="Xác nhận mật khẩu mới"
            placeholder="Xác nhận mật khẩu"
            value={data.confirmPassword}
            error={errors.confirmPassword}
            onChange={(value) => updateField("confirmPassword", value)}
          />
        </div>
        <button
          type="submit"
          className="focus-ring mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
        >
          <Save size={17} />
          Cập nhật thông tin
        </button>
      </form>
    </section>
  );
}

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function PasswordInput({ label, placeholder, value, error, onChange }: PasswordInputProps) {
  const fieldName = label.toLowerCase().replace(/\s+/g, "");
  const autoCompleteMap: Record<string, string> = {
    "mậtkhẩuhiệntại": "current-password",
    "mậtkhẩumới": "new-password",
    "xácnhậnmậtkhẩumới": "new-password",
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
        type="password"
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-[52px] w-full rounded-2xl border bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
          error
            ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
        }`}
      />
      {error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
    </label>
  );
}

export default SecurityForm;
