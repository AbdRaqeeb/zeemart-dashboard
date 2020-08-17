import {Category, Type, Product} from '../../../database/models';
import {validateCategory} from '../../../middleware/Validate';
import {uploadImage} from '../../../helpers/upload';

/**
 * @class Categories
 * @desc Controller for categories
 **/

class CategoryController {
    /**
     * @static
     * @desc    Add a category
     * @param {object} req express req object
     * @param {object} res express res object
     * @returns {object} json category object
     **/
    static async addCategory(req, res) {
        const {error} = validateCategory(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const image = uploadImage(req.files.image);

        const {name} = req.body;
        try {
            const check = await Category.findOne({
                where: {
                    name
                }
            });

            if (check) return res.status(400).json({
                error: true,
                msg: 'Category already exist'
            })

            const category = await Category.create({
                name,
                image
            });

            return res.status(200).json({
                error: false,
                category
            })
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }

    /**
     * @static
     * @desc    Get all categories
     * @param {object} req express req object
     * @param {object} res express res object
     * @returns {object} json category object
     **/
    static async getCategories(req, res) {
        try {
            const categories = await Category.findAndCountAll({
                include: Type
            });

            if (!categories) return res.status(404).json({
                error: true,
                msg: 'No category found'
            });

            return res.status(200).json({
                error: false,
                categories
            })

        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }

    /**
     * @static
     * @desc    Get a category
     * @param {object} req express req object
     * @param {object} res express res object
     * @returns {object} json category object
     **/
    static async getCategory(req, res) {
        const {id} = req.params;
        try {
            const category = await Category.findByPk(id, {
                include: Product
            });

            if (!category) return res.status(404).json({
                error: true,
                msg: 'Category not found'
            });

            return res.status(200).json({
                error: false,
                category
            })
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }

    /**
     * @static
     * @desc    Update a category
     * @param {object} req express req object
     * @param {object} res express res object
     * @returns {object} json category object
     **/
    static async updateCategory(req, res) {
        const {error} = validateCategory(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const image = uploadImage(req.files.image);
        const {name} = req.body;
        const {id} = req.params;
        try {
            const category = await Category.findByPk(id);

            if (!category) return res.status(404).json({
                error: true,
                msg: 'Category not found'
            });

            const updatedCategory = await category.update({name, image});

            return res.status(200).json({
                error: false,
                updatedCategory
            })
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }

    /**
     * @static
     * @desc   Delete a category
     * @param {object} req express req object
     * @param {object} res express res object
     * @returns {object} json category object
     **/
    static async deleteCategory(req, res) {
        const {id} = req.params;
        try {
            const category = await Category.findByPk(id);

            if (!category) return res.status(404).json({
                error: true,
                msg: 'Category not found'
            });

            await category.destroy({force: true});

            return res.status(200).json({
                error: false,
                msg: 'Category deleted successfully'
            })
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }
}

export default CategoryController;