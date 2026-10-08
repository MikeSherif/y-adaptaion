import type { OnboardingTemplate } from '@/shared/types/domain';

export function countTemplateTasks(template: OnboardingTemplate) {
  return template.stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
}

export function templateDuration(template: OnboardingTemplate) {
  return Math.max(0, ...template.stages.map((stage) => stage.endOffset)) + 1;
}
