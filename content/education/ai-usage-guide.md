---
title: "人工智能使用指南（实操版）"
category: "学习与教育"
updated: "2026-03-01"
summary: "围绕 OpenClaw 与 Gemini 的上手配置，给出可直接执行的操作路径与提示词要点。"
---

## 先说核心
**这份指南的重点不是“知道工具”，而是“能稳定跑通一次完整流程”。**

<span style="color:#c00000">请务必保护好 API Key，不要截图外传，也不要提交到公开仓库。</span>

---

## 1. OpenClaw 是什么
- OpenClaw 是本地 AI Agent，可按指令执行终端和文件相关操作
- 常见用途包括：代码修改、批量处理文件、自动化执行命令
- 使用边界主要受平台权限与接口开放程度限制

---

## 2. OpenClaw 安装与初始配置
### 安装命令
在 `Win + R` 打开并以管理员权限运行 `PowerShell`，执行：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### 模型建议
- 性价比较高方案：DeepSeek API
- 先在 DeepSeek API 页面充值 Token 并创建密钥（`sk-...`）

### 在安装向导中填写
- `Custom Provider`
- `API Base URL`: `https://api.deepseek.com`
- `API Key`: 你的 `sk-...`
- `Model Name`: `deepseek-coder`（编程优先）或 `deepseek-chat`

---

## 3. OpenClaw 启动方式
安装完成后，在 PowerShell 中依次执行：

```powershell
openclaw gateway
openclaw tui
```

- `openclaw gateway`：启动网关
- `openclaw tui`：进入会话界面

---

## 4. Gemini 使用路径（Chrome 环境）
### 基础准备
- Chrome 语言建议切到英文环境
- 节点建议选择美国

### 开启实验项
1. 打开 `chrome://flags/`
2. 搜索 `glic`
3. 将相关选项从 `Default` 改为 `Enabled`
4. 关闭并重启 Chrome

### 本地配置项（Local State）
编辑：
`%LOCALAPPDATA%\Google\Chrome\User Data\Local State`

重点检查以下字段：
- `"variations_country": "us"`
- `"variations_permanent_consistency_country": ["你的Chrome版本号", "us"]`
- `"is_glic_eligible": true`

**建议先备份原文件，再修改。**

---

## 5. 提示词技巧（高频有效）
- 给 AI 一个明确身份（例如“你是资深前端工程师”）
- 一次只提一个目标，避免把多个任务揉在同一句
- 先让 AI 复述理解，再让它执行
- 让 AI 先给出执行计划，再逐步落地

**一个实用模板：**
> 你是[角色]。目标是[结果]。约束是[限制条件]。请先给执行步骤，再按步骤产出可直接运行的内容。

---

## 一句话总结
**先把环境跑通，再追求高级技巧。**  
真正有效的 AI 使用方式，是“可重复、可验证、可回滚”。
