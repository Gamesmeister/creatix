import { IIdeaStreamSort } from "../models";

export class IdeaSortService {
    public getSortLinks(): IIdeaStreamSort[] {
        let sortLinks: IIdeaStreamSort[] = [
            {
                title: "Latest",
                order: 1,
                queryString: "$orderby=Created desc"
            },
            {
                title: "Commented",
                order: 2,
                queryString: "$orderby=Comments desc"
            }
        ];
        return sortLinks;
    }
}