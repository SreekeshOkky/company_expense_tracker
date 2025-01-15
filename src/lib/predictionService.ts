import * as tf from '@tensorflow/tfjs';
import { format, addDays, parseISO, subDays } from 'date-fns';
import { WeeklyExpense } from '../types';

interface DailyData {
  date: string;
  morning: number;
  lunch: number;
  evening: number;
  dayOfWeek: number;
}

export class ExpensePredictionService {
  private model: tf.LayersModel | null = null;
  private readonly SEQUENCE_LENGTH = 5; // Look at last 5 days to predict next day
  private readonly FEATURES = 4; // morning, lunch, evening, dayOfWeek

  async trainModel(weeklyData: WeeklyExpense['days']) {
    const data = this.prepareTrainingData(weeklyData);
    if (data.length < this.SEQUENCE_LENGTH + 1) return null;

    // Prepare sequences for training
    const sequences = [];
    const targets = [];

    for (let i = 0; i <= data.length - this.SEQUENCE_LENGTH - 1; i++) {
      const sequence = data.slice(i, i + this.SEQUENCE_LENGTH);
      const target = data[i + this.SEQUENCE_LENGTH];
      
      sequences.push(sequence.map(day => [
        day.morning / 1000, // Normalize values
        day.lunch / 1000,
        day.evening / 1000,
        day.dayOfWeek / 7 // Normalize day of week
      ]));
      
      targets.push([
        target.morning / 1000,
        target.lunch / 1000,
        target.evening / 1000
      ]);
    }

    const xs = tf.tensor3d(sequences);
    const ys = tf.tensor2d(targets);

    // Create LSTM model
    this.model = tf.sequential({
      layers: [
        tf.layers.lstm({
          units: 32,
          inputShape: [this.SEQUENCE_LENGTH, this.FEATURES],
          returnSequences: false
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 3 })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    await this.model.fit(xs, ys, {
      epochs: 100,
      batchSize: 32,
      shuffle: true,
      validationSplit: 0.1
    });

    xs.dispose();
    ys.dispose();

    return this.model;
  }

  async predictNextDays(weeklyData: WeeklyExpense['days'], daysToPredict: number = 2): Promise<DailyData[]> {
    if (!this.model) return [];

    const data = this.prepareTrainingData(weeklyData);
    if (data.length < this.SEQUENCE_LENGTH) return [];

    const predictions: DailyData[] = [];
    let sequence = data.slice(-this.SEQUENCE_LENGTH);
    const lastDate = parseISO(sequence[sequence.length - 1].date);

    for (let i = 0; i < daysToPredict; i++) {
      const input = tf.tensor3d([sequence.map(day => [
        day.morning / 1000,
        day.lunch / 1000,
        day.evening / 1000,
        day.dayOfWeek / 7
      ])]);

      const prediction = this.model.predict(input) as tf.Tensor;
      const [morning, lunch, evening] = Array.from(prediction.dataSync())
        .map(val => Math.max(0, Math.round(val * 1000))); // Denormalize and ensure non-negative

      const nextDate = addDays(lastDate, i + 1);
      const nextDayOfWeek = nextDate.getDay();
      
      // Skip weekends in predictions
      if (nextDayOfWeek === 0 || nextDayOfWeek === 6) {
        input.dispose();
        prediction.dispose();
        continue;
      }

      const predictedDay = {
        date: format(nextDate, 'yyyy-MM-dd'),
        morning,
        lunch,
        evening,
        dayOfWeek: nextDayOfWeek
      };

      predictions.push(predictedDay);
      
      // Update sequence for next prediction
      sequence = [...sequence.slice(1), predictedDay];

      input.dispose();
      prediction.dispose();
    }

    return predictions;
  }

  private prepareTrainingData(weeklyData: WeeklyExpense['days']): DailyData[] {
    // Get data for the last 30 days
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    return Object.entries(weeklyData)
      .filter(([date]) => {
        const dateObj = parseISO(date);
        return dateObj >= thirtyDaysAgo && dateObj <= today;
      })
      .map(([date, data]) => {
        const dateObj = parseISO(date);
        return {
          date,
          morning: data.meals.morning.reduce((sum, exp: any) => sum + exp.amount, 0),
          lunch: data.meals.lunch.reduce((sum, exp: any) => sum + exp.amount, 0),
          evening: data.meals.evening.reduce((sum, exp: any) => sum + exp.amount, 0),
          dayOfWeek: dateObj.getDay()
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}