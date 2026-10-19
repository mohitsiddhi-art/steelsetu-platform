import express from 'express';
import cors from 'cors';
import { calculatePlainSheetWeightKg, calculateCorrugatedWeightKg } from './utils/steel-math';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'Steelsetu Enterprise API',
    location: 'Kolkata - Burrabazar',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/v1/calc/sheet', (req, res) => {
  const { lengthM, widthM, thicknessMm, pitchFactor } = req.body;
  const plainKg = calculatePlainSheetWeightKg(Number(lengthM), Number(widthM), Number(thicknessMm));
  const corrugatedKg = calculateCorrugatedWeightKg(plainKg, Number(pitchFactor || 0.06));
  res.json({ plainWeightKg: plainKg, corrugatedWeightKg: corrugatedKg });
});

app.listen(PORT, () => {
  console.log(`Steelsetu API listening on http://localhost:${PORT}`);
});
