const { Router } = require("express");
const {userMiddleware} = require("../middleware/user");
const { Todo } = require("../database/index.js");
const router = Router();
const z = require("zod");

const todoSchema = z.object({
    id : z.string().length(24),
    userId: z.string().length(24),
    title: z.string(),
    description : z.string(),
    done : z.boolean()
});

function isSafe(obj) {
    try {
        todoSchema.parse(obj) ;
    }
    catch(e) {
        return false ;
    }
    return true ;
}

// todo Routes
router.post('/', userMiddleware, async (req, res) => {
    const userId = req.userId ;
    const title = req.body.title 
    const description = req.body.description ;
    const done = false ;

    if (!isSafe({userId, title, description, done})) { ;
        return res.json({message : "Input doesn't match the requirements!!"}) ;
    }

    await Todo.create({userId, title, description, done}) ;
    res.json({message : "Todo created successfully"}) ;
});

router.put('/', userMiddleware, async (req, res) => {
    // Implement update todo  logic
    const userId = req.userId ;
    const id = req.body.id ;
    const title = req.body.title ;
    const description = req.body.description ;
    const done = req.body.done ;

    if (!isSafe({id, userId, title, description, done})) { ;
        return res.json({message : "Input doesn't match the requirements!!"}) ;
    }

    await Todo.findOneAndUpdate({userId, _id : id}, {title, description, done}) ;
    res.json({message : "Todo updated successfully"}) ;
});

router.delete('/', userMiddleware, async (req, res) => {
    // Implement delete todo logic
    const userId = req.userId ;
    const title = req.body.title ;

    if (!isSafe({userId, title})) { ;
        return res.json({message : "Input doesn't match the requirements!!"}) ;
    }

    await Todo.deleteOne({userId, title}) ;
    res.json({message : "Todo deleted successfully"}) ;
});

router.delete('/:id', userMiddleware, async (req, res) => {
    // Implement delete todo by id logic
    const id = req.params.id ;

    if (!isSafe({userId, title, description, done})) { ;
        return res.json({message : "Input doesn't match the requirements!!"}) ;
    }

    await Todo.deleteOne({_id : id}) ;
    res.json({message : "Todo deleted successfully"}) ;
});


router.get('/', userMiddleware, async (req, res) => {
    // Implement fetching all todo logic
    const todos = await Todo.find({}) ;
    res.json({todos}) ;
});

router.get('/:id', userMiddleware, async (req, res) => {
    // Implement fetching todo by id logic
    const id = req.params.id ;
    if (!isSafe({id})) { ;
        return res.json({message : "Input doesn't match the requirements!!"}) ;
    }
    const todo = await Todo.find({_id : id}) ;
    res.json({todo}) ;
});

module.exports = router;