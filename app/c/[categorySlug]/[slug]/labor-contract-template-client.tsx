"use client";

import { useMemo, useState } from "react";

type FormData = {
  employer_name: string;
  employer_uscc: string;
  employer_representative: string;
  employer_registered_address: string;
  employer_business_address: string;
  employer_phone: string;
  employee_name: string;
  employee_id: string;
  employee_hukou_address: string;
  employee_contact_address: string;
  employee_phone: string;
  term_type: string;
  start_date: string;
  end_date: string;
  probation_end_date: string;
  position: string;
  job_duties: string;
  work_location: string;
  worktime_type: string;
  worktime_cycle: string;
  wage_type: string;
  monthly_wage: string;
  piece_rate: string;
  base_wage: string;
  performance_rule: string;
  wage_other: string;
  probation_wage: string;
  payday: string;
  sign_date: string;
  employer_sign_date: string;
  employee_sign_date: string;
};

const DEFAULT_FORM: FormData = {
  employer_name: "",
  employer_uscc: "",
  employer_representative: "",
  employer_registered_address: "",
  employer_business_address: "",
  employer_phone: "",
  employee_name: "",
  employee_id: "",
  employee_hukou_address: "",
  employee_contact_address: "",
  employee_phone: "",
  term_type: "1",
  start_date: "",
  end_date: "",
  probation_end_date: "",
  position: "",
  job_duties: "",
  work_location: "",
  worktime_type: "1",
  worktime_cycle: "",
  wage_type: "1",
  monthly_wage: "",
  piece_rate: "",
  base_wage: "",
  performance_rule: "",
  wage_other: "",
  probation_wage: "",
  payday: "",
  sign_date: "",
  employer_sign_date: "",
  employee_sign_date: "",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^(\d{15}|\d{17}[\dXx])$/;

function parseFileNameFromDisposition(disposition: string | null): string | null {
  if (!disposition) return null;
  const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1]);
  const normalMatch = disposition.match(/filename="?([^";]+)"?/i);
  return normalMatch?.[1] ?? null;
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <span>
      {text}
      {required ? <em className="contract-required">*</em> : null}
    </span>
  );
}

export default function LaborContractTemplateClient() {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const isEndDateRequired = form.term_type !== "3";
  const isWorktimeCycleRequired = form.worktime_type === "2";
  const isMonthlyWageRequired = form.wage_type === "1";
  const isPieceRateRequired = form.wage_type === "2";
  const isBaseWageRequired = form.wage_type === "3";
  const isPerformanceRuleRequired = form.wage_type === "3";
  const isWageOtherRequired = form.wage_type === "4";

  const requiredErrors = useMemo(() => {
    const errors: string[] = [];

    const required: Array<[keyof FormData, string]> = [
      ["employer_name", "甲方名称"],
      ["employee_name", "乙方姓名"],
      ["employee_id", "身份证号"],
      ["term_type", "合同期限方式"],
      ["start_date", "起始日期"],
      ["position", "岗位"],
      ["work_location", "工作地点"],
      ["worktime_type", "工时制度"],
      ["wage_type", "工资方式"],
      ["payday", "发薪日"],
      ["sign_date", "签订日期"],
    ];

    for (const [field, label] of required) {
      if (!form[field]?.trim()) errors.push(`${label}为必填项`);
    }

    if (isEndDateRequired && !form.end_date.trim()) {
      errors.push("固定期限/无固定期限合同需填写结束日期");
    }

    if (!ID_RE.test(form.employee_id.trim())) {
      errors.push("身份证号码格式不正确");
    }

    const dateChecks: Array<[keyof FormData, string]> = [
      ["start_date", "起始日期"],
      ["end_date", "结束日期"],
      ["probation_end_date", "试用期截止"],
      ["sign_date", "签订日期"],
      ["employer_sign_date", "甲方日期"],
      ["employee_sign_date", "乙方日期"],
    ];

    for (const [field, label] of dateChecks) {
      if (form[field].trim() && !DATE_RE.test(form[field].trim())) {
        errors.push(`${label}格式应为 YYYY-MM-DD`);
      }
    }

    if (isWorktimeCycleRequired && !form.worktime_cycle.trim()) {
      errors.push("综合工时制度需填写工时周期");
    }

    if (isMonthlyWageRequired && !form.monthly_wage.trim()) {
      errors.push("工资方式为月工资时，月工资必填");
    }

    if (isPieceRateRequired && !form.piece_rate.trim()) {
      errors.push("工资方式为计件时，计件单价必填");
    }

    if ((isBaseWageRequired && !form.base_wage.trim()) || (isPerformanceRuleRequired && !form.performance_rule.trim())) {
      errors.push("工资方式为基本+绩效时，基本工资与绩效计发办法必填");
    }

    if (isWageOtherRequired && !form.wage_other.trim()) {
      errors.push("工资方式为其他时，其他说明必填");
    }

    if (!/^\d{1,2}$/.test(form.payday.trim())) {
      errors.push("发薪日请填写 1-31 的数字");
    }

    return errors;
  }, [
    form,
    isBaseWageRequired,
    isEndDateRequired,
    isMonthlyWageRequired,
    isPerformanceRuleRequired,
    isPieceRateRequired,
    isWageOtherRequired,
    isWorktimeCycleRequired,
  ]);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setMessage("");

    if (requiredErrors.length > 0) {
      setMessage(requiredErrors[0]);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/generate-labor-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "生成失败");
      }

      const blob = await response.blob();
      const fileName =
        parseFileNameFromDisposition(response.headers.get("content-disposition")) ||
        `劳动合同_${form.employee_name || "模板"}.docx`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage("已生成并开始下载。请检查文件内容后再使用。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "生成失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="post-shell contract-tool">
      <h2 className="contract-title">劳动合同范本（可用于自检）</h2>
      <p className="contract-note">
        基于《2024劳动合同示范文本（通用）》制作。填写后可下载 .docx 用于自检与留存。
      </p>
      <p className="contract-warning">免责声明：仅供参考，不构成法律意见；请结合当地政策和实际情况。</p>
      <p className="contract-helper">说明：带 <em className="contract-required">*</em> 为当前必填项，条件变化时会动态更新。</p>
      <ul className="contract-rule-list">
        <li>合同期限方式选择“固定期限/无固定期限”时，结束日期为必填。</li>
        <li>工时制度选择“综合计算工时”时，综合工时周期为必填。</li>
        <li>工资方式会触发对应字段必填（如月工资、计件单价、基本工资/绩效、其他说明）。</li>
      </ul>

      <div className="contract-grid">
        <label className="contract-field">
          <Label text="甲方用人单位" required />
          <input required value={form.employer_name} onChange={(e) => update("employer_name", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="统一社会信用代码" />
          <input value={form.employer_uscc} onChange={(e) => update("employer_uscc", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="法定代表人/委托代理人" />
          <input value={form.employer_representative} onChange={(e) => update("employer_representative", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="甲方注册地" />
          <input value={form.employer_registered_address} onChange={(e) => update("employer_registered_address", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="甲方经营地" />
          <input value={form.employer_business_address} onChange={(e) => update("employer_business_address", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="甲方联系电话" />
          <input value={form.employer_phone} onChange={(e) => update("employer_phone", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="乙方姓名" required />
          <input required value={form.employee_name} onChange={(e) => update("employee_name", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="身份证号码" required />
          <input required value={form.employee_id} onChange={(e) => update("employee_id", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="户籍地址" />
          <input value={form.employee_hukou_address} onChange={(e) => update("employee_hukou_address", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="通讯地址/经常居住地" />
          <input value={form.employee_contact_address} onChange={(e) => update("employee_contact_address", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="乙方联系电话" />
          <input value={form.employee_phone} onChange={(e) => update("employee_phone", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="合同期限方式" required />
          <select required value={form.term_type} onChange={(e) => update("term_type", e.target.value)}>
            <option value="1">1 固定期限</option>
            <option value="2">2 无固定期限</option>
            <option value="3">3 以完成任务为期限</option>
          </select>
        </label>
        <label className="contract-field">
          <Label text="起始日期（YYYY-MM-DD）" required />
          <input
            required
            value={form.start_date}
            onChange={(e) => update("start_date", e.target.value)}
            placeholder="2026-02-17"
          />
        </label>
        <label className="contract-field">
          <Label text="结束日期（YYYY-MM-DD）" required={isEndDateRequired} />
          <input
            required={isEndDateRequired}
            value={form.end_date}
            onChange={(e) => update("end_date", e.target.value)}
            placeholder={isEndDateRequired ? "必填，例如 2027-02-16" : "term_type=3 可空"}
          />
        </label>
        <label className="contract-field">
          <Label text="试用期截止" />
          <input
            value={form.probation_end_date}
            onChange={(e) => update("probation_end_date", e.target.value)}
            placeholder="2026-05-17"
          />
        </label>
        <label className="contract-field">
          <Label text="工作岗位" required />
          <input required value={form.position} onChange={(e) => update("position", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="岗位职责" />
          <input value={form.job_duties} onChange={(e) => update("job_duties", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="工作地点" required />
          <input required value={form.work_location} onChange={(e) => update("work_location", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="工时制度" required />
          <select required value={form.worktime_type} onChange={(e) => update("worktime_type", e.target.value)}>
            <option value="1">1 标准工时</option>
            <option value="2">2 综合计算工时</option>
            <option value="3">3 不定时工时</option>
          </select>
        </label>
        <label className="contract-field">
          <Label text="综合工时周期" required={isWorktimeCycleRequired} />
          <input
            required={isWorktimeCycleRequired}
            value={form.worktime_cycle}
            onChange={(e) => update("worktime_cycle", e.target.value)}
            placeholder={isWorktimeCycleRequired ? "必填，例如 按月" : "仅 worktime_type=2 时必填"}
          />
        </label>
        <label className="contract-field">
          <Label text="工资方式" required />
          <select required value={form.wage_type} onChange={(e) => update("wage_type", e.target.value)}>
            <option value="1">1 月工资</option>
            <option value="2">2 计件</option>
            <option value="3">3 基本+绩效</option>
            <option value="4">4 其他</option>
          </select>
        </label>
        <label className="contract-field">
          <Label text="月工资" required={isMonthlyWageRequired} />
          <input
            required={isMonthlyWageRequired}
            value={form.monthly_wage}
            onChange={(e) => update("monthly_wage", e.target.value)}
            placeholder={isMonthlyWageRequired ? "必填" : "wage_type=1 时必填"}
          />
        </label>
        <label className="contract-field">
          <Label text="计件单价" required={isPieceRateRequired} />
          <input
            required={isPieceRateRequired}
            value={form.piece_rate}
            onChange={(e) => update("piece_rate", e.target.value)}
            placeholder={isPieceRateRequired ? "必填" : "wage_type=2 时必填"}
          />
        </label>
        <label className="contract-field">
          <Label text="基本工资" required={isBaseWageRequired} />
          <input
            required={isBaseWageRequired}
            value={form.base_wage}
            onChange={(e) => update("base_wage", e.target.value)}
            placeholder={isBaseWageRequired ? "必填" : "wage_type=3 时必填"}
          />
        </label>
        <label className="contract-field">
          <Label text="绩效计发办法" required={isPerformanceRuleRequired} />
          <input
            required={isPerformanceRuleRequired}
            value={form.performance_rule}
            onChange={(e) => update("performance_rule", e.target.value)}
            placeholder={isPerformanceRuleRequired ? "必填" : "wage_type=3 时必填"}
          />
        </label>
        <label className="contract-field">
          <Label text="其他工资说明" required={isWageOtherRequired} />
          <input
            required={isWageOtherRequired}
            value={form.wage_other}
            onChange={(e) => update("wage_other", e.target.value)}
            placeholder={isWageOtherRequired ? "必填" : "wage_type=4 时必填"}
          />
        </label>
        <label className="contract-field">
          <Label text="试用期工资" />
          <input value={form.probation_wage} onChange={(e) => update("probation_wage", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="每月发薪日前（数字）" required />
          <input required value={form.payday} onChange={(e) => update("payday", e.target.value)} placeholder="10" />
        </label>
        <label className="contract-field">
          <Label text="签订日期（YYYY-MM-DD）" required />
          <input required value={form.sign_date} onChange={(e) => update("sign_date", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="甲方日期" />
          <input value={form.employer_sign_date} onChange={(e) => update("employer_sign_date", e.target.value)} />
        </label>
        <label className="contract-field">
          <Label text="乙方日期" />
          <input value={form.employee_sign_date} onChange={(e) => update("employee_sign_date", e.target.value)} />
        </label>
      </div>

      <div className="contract-actions">
        <button type="button" className="contract-btn" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "生成中..." : "生成并下载劳动合同（.docx）"}
        </button>
        {message ? (
          <p className="contract-message" aria-live="polite">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
