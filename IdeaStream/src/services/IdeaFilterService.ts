import { IIdeaFilter } from "../models";

export class IdeaFilterService {
    public getFilters(): IIdeaFilter[] {
        let filters: IIdeaFilter[] = [
            {
                categoryTitle: "IDEA STATUS",
                options: [
                    {
                        filterTitle: "Active",
                        queryString: "$filter=IdeaStatus eq 'Active'"
                    },
                    {
                        filterTitle: "In progress",
                        queryString: "$filter=IdeaStatus eq 'In Progress'"
                    },
                    {
                        filterTitle: "Sponsored",
                        queryString: "$filter=IdeaStatus eq 'Sponsored'"
                    },
                    {
                        filterTitle: "Delivered",
                        queryString: "$filter=IdeaStatus eq 'Delivered'"
                    }
                ]
            },
            {
                categoryTitle: "RECENCY",
                options: [
                    {
                        filterTitle: "Last 3 days",
                        queryString: "$filter=Created geq 'Today - 3'"
                    },
                    {
                        filterTitle: "Last 7 days",
                        queryString: "$filter=Created geq 'Today - 7'"
                    },
                    {
                        filterTitle: "Last 30 days",
                        queryString: "$filter=Created geq 'Today - 30'"
                    }
                ]
            }
        ];
        return filters;
    }
}