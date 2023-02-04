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

        // remove some fields for catagory
        const removefields = ["keyword","page","limit"];

        removefields.forEach(key=>delete querycopy[key]);

        // filter for price and rating
        let querystr = JSON.stringify(querycopy);
        querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
 

        this.query = this.query.find(JSON.parse(querystr));
        return this
    }
}

module.exports = ApiFeatures