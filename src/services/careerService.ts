/**
 * Career Service
 * Handles fetching open positions from Salesforce via Netlify function
 */

export interface Position {
    Id: string;
    Name: string;
    FullPositionURL__c?: string;
    Job_Applications__c?: number;
    Days_Open__c?: number;
    Educational_Requirements__c?: string;
    Functional_Area__c?: string;
    Hire_By__c?: string;
    Hiring_Manager__c?: string;
    Job_Description__c?: string;
    Job_Level__c?: string;
    Location__c?: string;
    Max_Pay__c?: number;
    Min_Pay__c?: number;
    Open_Date__c?: string;
    Responsibilities__c?: string;
    Skills_Required__c?: string;
    Status__c?: string;
    Travel_Required__c?: string;
    Type__c?: string;
    Years_Of_Experience__c?: number;
    Enabled__c?: boolean;
    Leads__c?: number;
    Contacts__c?: number;
    Interview_Document_Action__c?: string;
    Formatted_Name__c?: string;
}

export interface PositionsResponse {
    positions: Position[];
}

/**
 * Fetch open positions from Salesforce
 */
export const fetchPositions = async (
    accessToken: string,
    instanceUrl: string
): Promise<Position[]> => {
    try {
        const response = await fetch('/.netlify/functions/fetchPositions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: accessToken,
                instance_url: instanceUrl,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch positions: ${response.status}`);
        }

        const data: PositionsResponse = await response.json();
        return data.positions;
    } catch (error) {
        console.error('Error fetching positions:', error);
        throw error;
    }
};
