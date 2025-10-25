import { Router } from 'express';
import { CountryController } from '../controllers/countryController';

const router = Router();
const controller = new CountryController();

router.post('/countries/refresh', (req, res) => controller.refreshCountries(req, res));
router.get('/countries/image', (req, res) => controller.getImage(req, res));
router.get('/countries/:name', (req, res) => controller.getCountryByName(req, res));
router.delete('/countries/:name', (req, res) => controller.deleteCountry(req, res));
router.get('/countries', (req, res) => controller.getAllCountries(req, res));
router.get('/status', (req, res) => controller.getStatus(req, res));

export default router;