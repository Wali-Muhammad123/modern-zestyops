import { ApiResource } from "../resource";
import { OnboardingRequest, OnboardingResponse } from "../types";

export class OnboardingResource extends ApiResource<any> {
  constructor(client: any) {
    super(client, { resourcePath: '/onboarding/' });
  }
  async submitOnboarding(data: OnboardingRequest): Promise<OnboardingResponse> {
    const response = await this.client.post<OnboardingResponse>('/onboarding/', data);
    return response.data;
  }
}