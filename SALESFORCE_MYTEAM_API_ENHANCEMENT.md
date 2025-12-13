# Salesforce MyTeam API Enhancement Request

## Current Behavior

The `/services/apexrest/myteam/` endpoint currently returns data **only for the `currentContactId`**. When displaying the "My Team" view, subordinates show 0 for projects, requirements, and OKRs because their data is not included in the API response.

### Current Response Structure

```json
{
  "contact": {
    "id": "003xxx",
    "name": "Current User",
    "children": [
      { "id": "003yyy", "name": "Subordinate 1", "children": [] },
      { "id": "003zzz", "name": "Subordinate 2", "children": [] }
    ]
  },
  "hierarchy": [...],
  "teamMembers": [...],           // Only for currentContactId
  "requirementsInProgress": [...], // Only for currentContactId
  "requirementsNotCompleted": [...], // Only for currentContactId
  "requirementCounts": {...},      // Only for currentContactId
  "okrs": [...],                   // Only for currentContactId
  "learningMaterials": [...]       // Only for currentContactId
}
```

## Requested Enhancement

Add a `subordinateData` field to the response that includes summary data for each subordinate contact in the hierarchy.

### Requested Response Structure

```json
{
  "contact": {...},
  "hierarchy": [...],
  "teamMembers": [...],
  "requirementsInProgress": [...],
  "requirementsNotCompleted": [...],
  "requirementCounts": {...},
  "okrs": [...],
  "learningMaterials": [...],
  "subordinateData": {
    "003yyy": {
      "okrs": [
        {
          "id": "a0Xxxx",
          "name": "Objective Name",
          "status": "In Progress",
          "progress": 45,
          "quarter": "Q4 2025",
          "dueDate": "2025-12-31",
          "children": [...]
        }
      ],
      "requirementCounts": {
        "Completed": 5,
        "In Progress": 2,
        "Not Started": 1
      },
      "teamMembers": [
        {
          "Id": "a1Xxxx",
          "Name": "Project Name",
          "Allocation_Percentage__c": 50
        }
      ]
    },
    "003zzz": {
      "okrs": [...],
      "requirementCounts": {...},
      "teamMembers": [...]
    }
  }
}
```

## Fields Needed Per Subordinate

### OKRs (OKR__c)
For each subordinate, query their OKRs where `Owner__c` matches their associated User ID:
- `Id`
- `Name`
- `Status__c`
- `Progress__c`
- `Quarter__c`
- `Due_Date__c`
- `Parent_Objective__c`
- Child OKRs (key results)

### Requirements (Requirement__c)
For each subordinate, aggregate counts by `Status__c` where `OwnerId` matches their associated User ID:
- Count of Completed
- Count of In Progress
- Count of other statuses (total)

### Team Members (Team_build_member__c)
For each subordinate, query where `Name` matches their Contact Name:
- `Id`
- `Name`
- `Team_build__c`
- `Allocation__c` or `Allocation_Percentage__c`

## SOQL Query Examples

### Get OKRs for All Subordinates at Once
```sql
SELECT Id, Name, Status__c, Progress__c, Quarter__c, Due_Date__c, Parent_Objective__c, Owner__c
FROM OKR__c 
WHERE Owner__c IN (SELECT Associated_User__c FROM Contact WHERE ReportsTo.Id = :currentContactId)
ORDER BY Quarter__c DESC
```

### Get Requirement Counts for All Subordinates
```sql
SELECT OwnerId, Status__c, COUNT(Id) total
FROM Requirement__c
WHERE OwnerId IN (SELECT Associated_User__c FROM Contact WHERE ReportsTo.Id = :currentContactId)
GROUP BY OwnerId, Status__c
```

### Get Team Build Allocations
```sql
SELECT Id, Name, Team_build__c, Allocation__c, Allocation_Percentage__c
FROM Team_build_member__c
WHERE Name IN (SELECT Name FROM Contact WHERE ReportsTo.Id = :currentContactId)
```

## Performance Considerations

1. **Limit Depth**: Only include direct reports (depth = 1), not grandchildren
2. **Batch Queries**: Use single queries with `IN` clauses instead of N+1 queries
3. **Optional Flag**: Consider adding a request parameter `includeSubordinateData=true` to make it opt-in
4. **Caching**: Results can be cached as the data doesn't change frequently

## Frontend Impact

Once this enhancement is implemented:
1. The frontend will automatically display subordinate stats
2. No frontend code changes needed - it already handles the data structure
3. The `transformContactNodeToTeamMember` function in `teamService.ts` needs a minor update to read from `subordinateData`

## Contact

For questions about this enhancement, contact the frontend development team.

---

*Document created: December 2024*

