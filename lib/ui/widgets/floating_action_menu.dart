import 'package:flutter/material.dart';
import 'package:swiitch/core/theme/app_colors.dart';
import 'package:swiitch/ui/screens/jools_chat_screen.dart';

class FloatingActionMenu extends StatefulWidget {
  @override
  _FloatingActionMenuState createState() => _FloatingActionMenuState();
}

class _FloatingActionMenuState extends State<FloatingActionMenu>
    with SingleTickerProviderStateMixin {
  bool _isExpanded = false;
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 500),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggleMenu() {
    setState(() {
      _isExpanded = !_isExpanded;
      _isExpanded ? _controller.forward() : _controller.reverse();
    });
  }

  void _handleAction(String label, BuildContext context) {
    _toggleMenu();
    if (label == 'Jools') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => JoolsChatScreen()),
      );
    } else {
      // Placeholder for other actions
      print('$label tapped');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Floating action buttons that fly out
        if (_isExpanded) ..._buildActionButtons(),

        // Main floating button
        Positioned(
          bottom: 30,
          right: 30,
          child: FloatingActionButton(
            onPressed: _toggleMenu,
            backgroundColor: AppColors.nebulaPurple,
            child: AnimatedIcon(
              icon: AnimatedIcons.menu_close,
              progress: _controller,
              color: Colors.white,
            ),
          ),
        ),
      ],
    );
  }

  List<Widget> _buildActionButtons() {
    return [
      _buildActionButton('Pay', Icons.payment, -90, 0),
      _buildActionButton('Transfer', Icons.swap_horiz, -60, -60),
      _buildActionButton('Jools', Icons.auto_awesome, 0, -90),
    ];
  }

  Widget _buildActionButton(String label, IconData icon, double x, double y) {
    return Positioned(
      bottom: 100 + y,
      right: 30 + x,
      child: ScaleTransition(
        scale: CurvedAnimation(
          parent: _controller,
          curve: Interval(0.0, 1.0, curve: Curves.elasticOut),
        ),
        child: FloatingActionButton.extended(
          onPressed: () => _handleAction(label, context),
          icon: Icon(icon, color: Colors.white),
          label: Text(label),
          backgroundColor: AppColors.electricBlue,
        ),
      ),
    );
  }
}