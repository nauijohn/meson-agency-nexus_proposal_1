export class CampaignAssignedAFlowEvent {
  public static readonly eventName = "campaign.assigned_a_flow";

  public readonly campaignId: string;
  public readonly flow: {
    id: string;
    flowSteps?: {
      flowStepId?: string;
      scheduledAt?: Date;
      dueAt?: Date;
    }[];
  };

  constructor(data: {
    campaignId: string;
    flow: {
      id: string;
      flowSteps?: {
        flowStepId?: string;
        scheduledAt?: Date;
        dueAt?: Date;
      }[];
    };
  }) {
    this.campaignId = data.campaignId;
    this.flow = data.flow;
  }
}
