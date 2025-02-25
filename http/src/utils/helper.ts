export function getFilterOptions(q: string, c: any[], l: any[]) {
    let whereClause: any = {
        // isPublished: true
    };

    if (c.length > 0) {
        whereClause = {
            ...whereClause,
            category: { in: c }
        };
    }

    if(l.length > 0) {
        whereClause = {
            ...whereClause,
            level: { in: l }
        };
    }

    const searchConditions = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
    ];

    return {
        AND: [
            whereClause,
            { OR: searchConditions },
        ]
    };
}

export function getSortingOptions(sortBy: any) {
    let orderBy: any = {};

    switch(sortBy) {
        case "price-hightolow":
            orderBy = {
                price: "desc"
            };
            break;
        case "price-lowtohigh":
            orderBy = {
                price: "asc"
            };
            break;
        case "title-atoz":
            orderBy = {
                title: "asc"
            };
            break;
        case "title-ztoa":
            orderBy = {
                title: "desc"
            };
            break;
        default:
            orderBy = {
                createdAt: "desc"
            };
            break;
    }

    return orderBy;
}