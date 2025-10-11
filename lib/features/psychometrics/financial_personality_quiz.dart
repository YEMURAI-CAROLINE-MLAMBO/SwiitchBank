import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/psychometrics_service.dart';
import '../../ui/providers/user_data_provider.dart';
import '../../core/models/psychometric_profile.dart';

/// A model for a single question in the financial personality quiz.
class QuizQuestion {
  final String question;
  final Map<String, PersonalityTrait> options;

  QuizQuestion({required this.question, required this.options});
}

/// A list of questions for the financial personality quiz.
final List<QuizQuestion> quizQuestions = [
  QuizQuestion(
    question: "When the stock market drops 20%, you're most likely to:",
    options: {
      "Panic and sell everything": PersonalityTrait.riskAverse,
      "Hold and wait for it to recover": PersonalityTrait.moderate,
      "See it as a buying opportunity": PersonalityTrait.riskSeeker,
    },
  ),
  QuizQuestion(
    question: "You receive an unexpected bonus. What's your first instinct?",
    options: {
      "Put it all into savings or investments": PersonalityTrait.disciplinedSaver,
      "Splurge on something you've been wanting": PersonalityTrait.impulsiveSpender,
      "A mix of both saving and spending": PersonalityTrait.moderate,
    },
  ),
  QuizQuestion(
    question: "When it comes to financial planning, you prefer:",
    options: {
      "A detailed, long-term plan": PersonalityTrait.disciplinedSaver,
      "A flexible guideline that can change": PersonalityTrait.moderate,
      "To go with the flow and handle things as they come": PersonalityTrait.impulsiveSpender,
    },
  ),
  QuizQuestion(
    question: "Which investment sounds most appealing?",
    options: {
      "A high-yield savings account with guaranteed returns": PersonalityTrait.riskAverse,
      "A diversified index fund with market-average returns": PersonalityTrait.moderate,
      "A new cryptocurrency with high-risk but explosive potential": PersonalityTrait.riskSeeker,
    },
  ),
];

/// A screen that presents a quiz to determine the user's financial personality.
class FinancialPersonalityQuizScreen extends StatefulWidget {
  final Function(FinancialProfile) onQuizCompleted;

  const FinancialPersonalityQuizScreen({Key? key, required this.onQuizCompleted})
      : super(key: key);

  @override
  _FinancialPersonalityQuizScreenState createState() =>
      _FinancialPersonalityQuizScreenState();
}

class _FinancialPersonalityQuizScreenState
    extends State<FinancialPersonalityQuizScreen> {
  int _currentQuestionIndex = 0;
  final Map<int, PersonalityTrait> _answers = {};
  final PsychometricsService _psychometricsService = PsychometricsService();

  void _answerQuestion(PersonalityTrait trait) {
    setState(() {
      _answers[_currentQuestionIndex] = trait;
      if (_currentQuestionIndex < quizQuestions.length - 1) {
        _currentQuestionIndex++;
      } else {
        _processAndFinishQuiz();
      }
    });
  }

  void _processAndFinishQuiz() {
    final newProfile = _psychometricsService.assessFromQuiz(_answers);

    // Update the provider
    Provider.of<UserDataProvider>(context, listen: false).updateProfile(newProfile);

    // Use the callback
    widget.onQuizCompleted(newProfile);

    // Show a confirmation dialog before popping
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Quiz Complete!"),
        content: Text(
            "Your financial profile has been updated. Your dominant trait is: ${newProfile.spendingHabit.name}"),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close the dialog
              Navigator.of(context).pop(); // Go back from quiz screen
            },
            child: Text("Done"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentQuestion = quizQuestions[_currentQuestionIndex];
    final progress = (_currentQuestionIndex + 1) / quizQuestions.length;

    return Scaffold(
      appBar: AppBar(
        title: Text("Financial Quiz"),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(4.0),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).colorScheme.secondary),
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              currentQuestion.question,
              style: Theme.of(context).textTheme.headline5,
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 48.0),
            ...currentQuestion.options.entries.map((entry) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: ElevatedButton(
                  onPressed: () => _answerQuestion(entry.value),
                  child: Text(entry.key),
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    textStyle: TextStyle(fontSize: 16),
                  ),
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }
}