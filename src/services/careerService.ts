/**
 * Career Service
 * Handles fetching open positions from Salesforce via Netlify function
 */

export interface Position {
    Id: string;
    Name: string;
    Type__c?: string;
    Job_Description__c?: string;
    Min_Pay__c?: number;
    Max_Pay__c?: number;
    Formatted_Name__c?: string;
    Hire_By__c?: string;
    Location__c?: string;
    Responsibilities__c?: string;
    Skills_Required__c?: string;
    Educational_Requirements__c?: string;
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
