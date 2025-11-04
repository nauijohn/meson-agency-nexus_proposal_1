export class CampaignAssignedToFlowEvent {
  public static readonly eventName = "campaign.assigned_to_flow";
  constructor(
    public readonly campaignId: string,
    public readonly flowId: string,
  ) {}
}
