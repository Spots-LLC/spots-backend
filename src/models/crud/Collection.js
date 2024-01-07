'use strict';

const logger = require('../../utils/logger');

class Collection {
    constructor(model) {
        this.model = model;
    }

    // Centralize error handling
    handleError(method, error) {
        logger.error(`Error in the collection ${method} method`, error);
        throw new Error(`Error in the collection ${method} method`);
    }

    async create(json) {
        try {
            const record = await this.model.create(json);
            logger.info('Record created successfully', { record });
            return record;
        } catch (e) {
            this.handleError('create', e);
        }
    }

    async read(id, options = {}) {
        try {
            let record = null;
            if (id) {
                record = await this.model.findById(id, options);
            } else {
                record = await this.model.find(options);
            }
            logger.info('Read operation was successful', { record });
            return record;
        } catch (e) {
            this.handleError('read', e);
        }
    }

    async update(id, json) {
        try {
            const recordToUpdate = await this.model.findById(id);
            if (recordToUpdate) {
                await recordToUpdate.set(json).save();
                logger.info('Record updated successfully', { id });
                return recordToUpdate;
            } else {
                throw new Error('Record not found');
            }
        } catch (e) {
            this.handleError('update', e);
        }
    }

    async delete(id) {
        try {
            const result = await this.model.findByIdAndDelete(id);
            if (result) {
                logger.info('Record deleted successfully', { id });
                return { message: 'Record deleted successfully' };
            } else {
                throw new Error('Record not found or not deleted');
            }
        } catch (e) {
            if (e.message !== 'Record not found or not deleted') {
                this.handleError('delete', e);
            } else {
                throw e;
            }
        }
    }



    async findOne(options = {}) {
        try {
            const record = await this.model.findOne(options);
            logger.info('findOne operation was successful', { options });
            return record;
        } catch (e) {
            this.handleError('findOne', e);
        }
    }
}

module.exports = Collection;