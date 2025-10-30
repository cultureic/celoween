'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Award, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useCertificateGeneration, useHasCertificate } from '@/lib/hooks/useCertificateGeneration';
import { type Course } from '@prisma/client';

interface CertificateGeneratorProps {
  course: Course;
  completedModules: number;
  totalModules: number;
  completionPercentage: number;
}

export function CertificateGenerator({
  course,
  completedModules,
  totalModules,
  completionPercentage,
}: CertificateGeneratorProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const {
    generateCertificate,
    certificateHash,
    certificateError,
    isGenerating,
    isConfirmingCertificate,
    certificateSuccess,
    certificateData,
    resetCertificateData,
  } = useCertificateGeneration();
  
  const { hasCertificate } = useHasCertificate(address, course.slug, course.id);
  
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  
  // Check if course is complete (100% completion)
  const isCourseComplete = completionPercentage === 100;
  
  const handleGenerateCertificate = async () => {
    if (!address || !isConnected) return;
    
    try {
      await generateCertificate(
        course.slug,
        course.id,
        course.title,
        completedModules,
        address
      );
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    }
  };
  
  const handleDownloadCertificate = () => {
    // This would generate a PDF certificate or link to certificate viewer
    // For now, we'll show a preview
    setShowCertificatePreview(true);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Course Certificate
          </CardTitle>
          <CardDescription>
            Connect your wallet to generate a completion certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Wallet connection required to mint certificates
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!isCourseComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Course Certificate
          </CardTitle>
          <CardDescription>
            Complete all modules to earn your certificate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <Badge variant="secondary">
              {completedModules}/{totalModules} modules
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {totalModules - completedModules} more modules to complete
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Course Certificate
        </CardTitle>
        <CardDescription>
          Congratulations! You&apos;ve completed all course modules
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Course completion status */}
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">Course Complete</span>
          <Badge variant="default" className="bg-green-100 text-green-800">
            100% Complete
          </Badge>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full w-full" />
        </div>
        
        {/* Module completion summary */}
        <div className="text-sm text-muted-foreground">
          All {totalModules} modules completed successfully
        </div>

        {/* Certificate generation */}
        {!hasCertificate && !certificateSuccess && (
          <div className="space-y-4">
            <Button
              onClick={handleGenerateCertificate}
              disabled={isGenerating || isConfirmingCertificate}
              className="w-full"
            >
              {isGenerating || isConfirmingCertificate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isGenerating ? 'Generating Certificate...' : 'Confirming Transaction...'}
                </>
              ) : (
                <>
                  <Award className="mr-2 h-4 w-4" />
                  Generate NFT Certificate
                </>
              )}
            </Button>
            
            {certificateError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to generate certificate: {certificateError.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Certificate success */}
        {(certificateSuccess || hasCertificate) && (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Certificate successfully generated! Your NFT certificate has been minted to your wallet.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button onClick={handleDownloadCertificate} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                View Certificate
              </Button>
              
              {certificateHash && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://alfajores.celoscan.io/tx/${certificateHash}`, '_blank')}
                  className="flex-1"
                >
                  View Transaction
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Certificate preview modal */}
        {showCertificatePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Certificate Preview</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCertificatePreview(false)}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Award className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                  <h2 className="text-2xl font-bold mb-2">Certificate of Completion</h2>
                  <p className="text-lg mb-4">This certifies that</p>
                  <p className="text-xl font-semibold mb-4">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  <p className="text-lg mb-2">has successfully completed</p>
                  <p className="text-xl font-bold mb-4 text-primary">{course.title}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Completed {completedModules} of {totalModules} modules
                  </p>
                  {certificateData?.completionDate && (
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date(certificateData.completionDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="mt-6 text-center">
                  <Button onClick={() => setShowCertificatePreview(false)}>
                    Close Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}