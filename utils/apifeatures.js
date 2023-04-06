class ApiFeatures {
    constructor(query,querystr){
        this.query = query;
        this.querystr = querystr;
    }

    search(){
        const keyword = this.querystr.keyword ? {
            title:{
                $regex:this.querystr.keyword,
                $options: "i",
            }
        } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter(){
    const querycopy = {...this.querystr};

    // remove some fields for category
    const removefields = ["keyword","page","limit"];

    removefields.forEach(key=>delete querycopy[key]);

    // filter for price and rating
    let querystr = JSON.stringify(querycopy);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // add filter for active field
    const activeFilter = { active: true };
    const filterObj = JSON.parse(querystr);
    this.query = this.query.find({ ...filterObj, ...activeFilter });
    return this;

    }

    pagination(resultPerPage){
        const currentPage = Number(this.querystr.page) || 1;
        
        const skip = resultPerPage * (currentPage - 1)
    
        this.query = this.query.limit(resultPerPage).skip(skip);

        return this
    }
}

module.exports = ApiFeatures