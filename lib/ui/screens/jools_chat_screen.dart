import 'package:flutter/material.dart';
import 'package:swiitch/core/theme/app_colors.dart';
import 'package:swiitch/ui/animations/pulse_animation.dart';
import 'package:swiitch/ui/widgets/animated_action_chips.dart';
import 'package:swiitch/ui/widgets/animated_cosmic_background.dart';
import 'package:swiitch/ui/widgets/animated_logo_header.dart';
import 'package:swiitch/ui/widgets/jools_message_bubble.dart';

class JoolsChatScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cosmicBlack,
      body: Stack(
        children: [
          // Animated cosmic background
          AnimatedCosmicBackground(),

          Column(
            children: [
              // Animated header
              SafeArea(child: AnimatedLogoHeader()),

              Expanded(
                child: ShaderMask(
                  shaderCallback: (rect) {
                    return LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.8),
                      ],
                      stops: [0.9, 1.0]
                    ).createShader(rect);
                  },
                  blendMode: BlendMode.dstIn,
                  child: ListView(
                    padding: EdgeInsets.all(20),
                    children: [
                      // Jools introduction with typing animation
                      JoolsMessageBubble(
                        message: "Hi! I'm Jools 🚀",
                        isTyping: true,
                      ),

                      JoolsMessageBubble(
                        message: "Ready to make your finances cosmic?",
                      ),

                      SizedBox(height: 20),
                      // Quick action chips that pulse
                      AnimatedActionChips(),
                    ],
                  ),
                ),
              ),

              // Message input with glow
              _buildMessageInput(),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      margin: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.starDust.withOpacity(0.8),
        borderRadius: BorderRadius.circular(25),
        boxShadow: [
          BoxShadow(
            color: AppColors.electricBlue.withOpacity(0.2),
            blurRadius: 10,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              decoration: InputDecoration(
                hintText: "Ask Jools anything...",
                hintStyle: TextStyle(color: Colors.white54),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 20),
              ),
              style: TextStyle(color: Colors.white),
            ),
          ),
          // Send button with pulse animation
          PulseAnimation(
            child: IconButton(
              icon: Icon(Icons.send, color: AppColors.matrixGreen),
              onPressed: () {},
            ),
          ),
        ],
      ),
    );
  }
}