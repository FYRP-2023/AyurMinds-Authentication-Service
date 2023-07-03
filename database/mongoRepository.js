const mongoRepository = {
user:{
    add:(props)=>{
        return props.save();
    }
}
}

module.exports = mongoRepository;