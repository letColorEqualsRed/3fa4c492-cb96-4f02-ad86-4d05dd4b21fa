export interface GetDeviceSavingSummaryResponseDto {
    lifetimeCarbonSavings: number;
    lifetimeFueldSavings: number;
    currentMonthCarbonSavings: number;
    currentMonthFueldSavings: number;
}

export interface GetDeviceSavingByPeriodResponseDto {
    periodCarbonSavings: number;
    periodFueldSavings: number;
}