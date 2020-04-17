import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const valueBalance = {
      income: 0,
      outcome: 0,
    };

    if (type === 'income') {
      valueBalance.income = value;
      valueBalance.outcome = 0;
    } else {
      valueBalance.income = 0;
      valueBalance.outcome = value;
    }

    const balanceTransaction = this.transactionsRepository.getBalance(
      valueBalance,
    );

    if (balanceTransaction.total < 0) {
      throw Error('Not possible your transaction, empty money');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
